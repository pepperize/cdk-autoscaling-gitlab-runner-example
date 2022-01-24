import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { MachineImage } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomMachineImageProps extends RunnerStackProps {}

export class MachineImageStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomMachineImageProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    // remember to specify an AMI for your region if you choose to use your environment settings in your stack environment
    const managerAmiMap: Record<string, string> = {
      "us-east-1": "ami-0de53d8956e8dcf80",
    };

    // remember to specify an AMI for your region if you choose to use your environment settings in your stack environment
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
