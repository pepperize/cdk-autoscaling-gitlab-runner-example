import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomCacheBucketStackProps extends RunnerStackProps {}

export class CacheBucketStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomCacheBucketStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    const cache = new Bucket(this, "Cache", {
      // Your custom bucket
      bucketName: "your-custom-bucket",
    });

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          configuration: {
            token: gitlabToken,
            name: "gitlab-runner-with-custom-cache-settings",
          },
        },
      ],
      cache: { bucket: cache },
    });
  }
}
