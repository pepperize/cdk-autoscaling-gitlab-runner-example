import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomCacheBucketStackProps extends RunnerStackProps {}

export class ZeroConfigStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomCacheBucketStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          configuration: {
            token: gitlabToken,
          },
        },
      ],
    });
  }
}
