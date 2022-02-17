import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomVpcStackProps extends RunnerStackProps {}

export class VpcStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomVpcStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const token = new StringParameter(this, "Token", {
      parameterName: "/gitlab-runner/token",
      stringValue: gitlabToken,
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    const vpc = new Vpc(this, "Vpc", {
      // Your custom vpc
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          token: token,
          configuration: {
            name: "gitlab-runner-with-custom-vpc",
          },
        },
      ],
      network: { vpc: vpc },
    });
  }
}
