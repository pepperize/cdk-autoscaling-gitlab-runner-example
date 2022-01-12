import { Construct, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomDockerMachineConfigurationProps extends RunnerStackProps {}

export class DockerMachineStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomDockerMachineConfigurationProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        docker: {
          capAdd: ["CAP_NET_ADMIN"],
          capDrop: ["CAP_CHOWN"],
          privileged: false,
          pullPolicy: "never",
          waitForServicesTimeout: 600,
        },
        machine: {
          idleCount: 2,
          idleTime: 3000,
          maxBuilds: 1,
        },
      },
    });
  }
}
