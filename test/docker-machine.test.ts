import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { DockerMachineStack } from "../src/docker-machine";

describe("DockerMachineConfiguration", () => {
  it("Should set docker machine properties", () => {
    // Given
    const app = new App();

    // When
    const stack = new DockerMachineStack(app, "DockerMachineConfigurationStack", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(JSON.stringify(template)).toContain('cap_add = [ \\"CAP_NET_ADMIN\\" ]');
    expect(JSON.stringify(template)).toContain('cap_drop = [ \\"CAP_CHOWN\\" ]');
    expect(JSON.stringify(template)).toContain("privileged = false");
    expect(JSON.stringify(template)).toContain('pull_policy = \\"never\\"');
    expect(JSON.stringify(template)).toContain("wait_for_services_timeout = 600");
    expect(JSON.stringify(template)).toContain("IdleCount = 2");
    expect(JSON.stringify(template)).toContain("IdleTime = 3_000");
    expect(JSON.stringify(template)).toContain("MaxBuilds = 1");
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();

    // When
    const stack = new DockerMachineStack(app, "DockerMachineConfigurationStack", {
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
