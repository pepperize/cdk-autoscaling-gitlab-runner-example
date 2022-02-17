import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomCacheBucketStackProps extends RunnerStackProps {}

export class ZeroConfigStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomCacheBucketStackProps) {
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
            name: "gitlab-runner-zero-config",
          },
        },
      ],
    });
  }
}
