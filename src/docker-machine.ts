import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomDockerMachineConfigurationProps extends RunnerStackProps {}

export class DockerMachineStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomDockerMachineConfigurationProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          configuration: {
            token: gitlabToken,
            name: "gitlab-runner-with-custom-docker-config",
            environment: [], // Reset the OverlayFS driver for every project
            docker: {
              capAdd: [], // Remove the CAP_SYS_ADMIN
              privileged: false, // Run unprivileged
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
