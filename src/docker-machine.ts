import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomDockerMachineConfigurationProps extends RunnerStackProps {}

export class DockerMachineStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomDockerMachineConfigurationProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const token = new StringParameter(this, "Token", {
      parameterName: "/gitlab-runner/token",
      stringValue: gitlabToken,
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          token: token,
          configuration: {
            name: "gitlab-runner-with-custom-docker-config",
            environment: [], // Reset the OverlayFS driver for every project
            docker: {
              capAdd: ["CAP_NET_ADMIN"], // Remove the CAP_SYS_ADMIN
              capDrop: ["CAP_CHOWN"],
              privileged: false, // Run unprivileged
              pullPolicy: "never",
              waitForServicesTimeout: 600,
            },
            machine: {
              idleCount: 2, // Number of idle machine
              idleTime: 3000, // Waiting time in idle state
              maxBuilds: 1, // Max builds before instance is removed
            },
          },
        },
      ],
    });
  }
}
