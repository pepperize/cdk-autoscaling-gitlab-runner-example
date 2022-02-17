import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomInstanceTypeProps extends RunnerStackProps {}

export class InstanceTypeStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomInstanceTypeProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const token = new StringParameter(this, "Token", {
      parameterName: "/gitlab-runner/token",
      stringValue: gitlabToken,
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      manager: {
        instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL),
      },
      runners: [
        {
          instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.LARGE),
          token: token,
          configuration: {
            name: "gitlab-runner-with-custom-instance-type",
          },
        },
      ],
    });
  }
}
