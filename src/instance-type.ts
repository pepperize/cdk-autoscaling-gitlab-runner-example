import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomInstanceTypeProps extends RunnerStackProps {}

export class InstanceTypeStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomInstanceTypeProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      manager: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      },
      runners: [
        {
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          configuration: {
            token: "<auth token>",
          },
        },
      ],
    });
  }
}
