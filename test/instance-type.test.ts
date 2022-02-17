import { App } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { InstanceTypeStack } from "../src/instance-type";

describe("InstanceType", () => {
  it("Should set custom instance type", () => {
    // Given
    const app = new App();

    // When
    const stack = new InstanceTypeStack(app, "InstanceTypeStack", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);

    expect(JSON.stringify(template)).toContain("instance-type=t3.large");

    const capture = new Capture();
    template.hasResourceProperties("AWS::AutoScaling::LaunchConfiguration", capture);
    expect(capture.asObject()).toMatchObject({ InstanceType: "t3.small" });
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();

    // When
    const stack = new InstanceTypeStack(app, "InstanceTypeStack", {
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
