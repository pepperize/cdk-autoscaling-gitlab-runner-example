import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { InstanceTypeStack } from "../src/instance-type";

describe("InstanceType", () => {
  it("Should set custom instance type", () => {
    const app = new App();
    const stack = new InstanceTypeStack(app, "InstanceTypeStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    // When
    const template = Template.fromStack(stack);


    // Then
    const capture = new Capture();

    expect(JSON.stringify(template)).toContain("instance-type=t3.large");

    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", capture);
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new InstanceTypeStack(app, "InstanceTypeStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });

});
