import { MachineImage } from "@aws-cdk/aws-ec2";
import { Construct, Stack } from "@aws-cdk/core";
import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomMachineImageProps extends RunnerStackProps {}

export class MachineImageStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomMachineImageProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const managerAmiMap: Record<string, string> = {
      "us-east-1": "ami-0de53d8956e8dcf80",
    };

    const runnerAmiMap: Record<string, string> = {
      "us-east-1": "ami-06992628e0a8e044c",
    };

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      manager: {
        // Amazon Linux, CentOS, ...
        machineImage: MachineImage.genericLinux(managerAmiMap),
      },
      runners: {
        // Any provisioner https://gitlab.com/gitlab-org/ci-cd/docker-machine/-/tree/main/libmachine/provision
        machineImage: MachineImage.genericLinux(runnerAmiMap),
      },
    });
  }
}
