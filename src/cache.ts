import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomCacheBucketStackProps extends RunnerStackProps {}

export class CacheBucketStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomCacheBucketStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const token = new StringParameter(this, "Token", {
      parameterName: "/gitlab-runner/token",
      stringValue: gitlabToken,
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    const cache = new Bucket(this, "Cache", {
      // Your custom bucket
      bucketName: "your-custom-bucket",
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          token: token,
          configuration: {
            name: "gitlab-runner-with-custom-cache-settings",
          },
        },
      ],
      cache: { bucket: cache },
    });
  }
}
