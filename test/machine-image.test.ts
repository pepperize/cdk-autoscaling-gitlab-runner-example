import { Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { MachineImageStack } from "../src/machine-image";

describe("MachineImage", () => {
  it("Should set custom instance type", () => {
    // Given
    const app = new App();

    // When
    const stack = new MachineImageStack(app, "MachineImageStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "123456789012",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(JSON.stringify(template)).toContain("ami=ami-06992628e0a8e044c");
    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", {});
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();

    // When
    const stack = new MachineImageStack(app, "MachineImageStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "123456789012",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
  });
});
