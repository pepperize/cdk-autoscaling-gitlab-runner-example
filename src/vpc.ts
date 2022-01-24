import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomVpcStackProps extends RunnerStackProps {}

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomVpcStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const vpc = new Vpc(this, "Vpc", {
      // Your custom vpc
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      network: { vpc: vpc },
    });
  }
}
