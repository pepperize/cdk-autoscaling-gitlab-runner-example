import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { OnDemandInstancesStack } from "../src/on-demand-instances";

describe("OnDemandInstances", () => {
  it("Should set amazonec2-request-spot-instance to false", () => {
    const app = new App();
    const stack = new OnDemandInstancesStack(app, "ZeroConfigStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });
    const template = Template.fromStack(stack);
    expect(JSON.stringify(template)).toContain("request-spot-instance=false");
    const capture = new Capture();
    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", capture);
    expect(template).toMatchSnapshot();
  });
});
