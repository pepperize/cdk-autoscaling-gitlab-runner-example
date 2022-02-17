import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { OnDemandInstancesStack } from "../src/on-demand-instances";

describe("OnDemandInstances", () => {
  it("Should set amazonec2-request-spot-instance to false", () => {
    // Given
    const app = new App();

    // When
    const stack = new OnDemandInstancesStack(app, "OnDemandInstances", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(JSON.stringify(template)).toContain("request-spot-instance=false");
    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", {});
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();

    // When
    const stack = new OnDemandInstancesStack(app, "OnDemandInstances", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
  });
});
