import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { MachineImageStack } from "../src/machine-image";

describe("MachineImage", () => {
  it("Should set custom instance type", () => {
    const app = new App();
    const stack = new MachineImageStack(app, "MachineImageStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "123456789012",
        region: "us-east-1",
      },
    });
    const template = Template.fromStack(stack);

    const capture = new Capture();

    expect(JSON.stringify(template)).toContain("ami=ami-06992628e0a8e044c");

    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", capture);
  });


  it("Should set custom instance type", () => {
    const app = new App();
    const stack = new MachineImageStack(app, "MachineImageStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "123456789012",
        region: "us-east-1",
      },
    });
    const template = Template.fromStack(stack);

    expect(template).toMatchSnapshot();
  });
});
