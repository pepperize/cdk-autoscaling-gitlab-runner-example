import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithOnDemandInstancesStackProps extends RunnerStackProps {}

export class OnDemandInstancesStack extends Stack {
  constructor(scope: Construct, id: string, props: WithOnDemandInstancesStackProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    new GitlabRunnerAutoscaling(this, "Runner", {
      gitlabToken: gitlabToken,
      runners: {
        machine: {
          machineOptions: {
            requestSpotInstance: false,
          },
        },
      },
    });
  }
}
