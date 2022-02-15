import {
  GitlabRunnerAutoscaling,
  GitlabRunnerAutoscalingJobRunnerProps,
} from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack, StackProps } from "aws-cdk-lib";
import { PolicyDocument, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";

/**
 * Each runner defines one `[[runners]]` section in the configuration file.
 * @see https://docs.gitlab.com/runner/configuration/
 * Use Specific runners when you want to use runners for specific projects.
 * @see https://docs.gitlab.com/ee/ci/runners/runners_scope.html#specific-runners
 */
export class MultipleRunnersStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    /**
     * WARNING: Allows all actions for all resources. DO NOT USE THIS ROLE EXAMPLE IN YOUR PROJECTS!
     */
    const privilegedRole = new Role(this, "PrivilegedRunnersRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      inlinePolicies: {
        AllowAll: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["*"],
              Resource: ["*"],
            },
          ],
        }),
      },
    });

    /**
     * Denies all actions.
     */
    const restrictedRole = new Role(this, "RestrictedRunnersRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      inlinePolicies: {
        AllowAll: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Deny",
              Action: ["*"],
              Resource: ["*"],
            },
          ],
        }),
      },
    });

    /**
     * Unprotected runner t3.medium unprivileged work hours 10-18:00, 30 min idle time, teardown after 20 jobs, 1 hot standby
     */
    const runner1: GitlabRunnerAutoscalingJobRunnerProps = {
      // unprotected runner ?
      configuration: {
        token: "gitlab-token1",
        name: "gitlab-runner1",
        machine: {
          maxBuilds: 20, // teardown after 20 jobs
          idleCount: 0, // no instances except for the periods that are set at the autoscaling configuration
          autoscaling: [
            {
              idleCount: 1, // 1 hot standby
              idleTime: 1800, // 30 min idle time
              periods: ["* * 10-18 * * *"], // work hours 10-18:00
            },
          ],
        },
        docker: {
          privileged: false, // unprivileged
        },
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM), // t3.medium
    };

    /**
     * Protected runner t3.small unprivileged, work hours 13-17:00, 15 min idle time, teardown after 5 jobs
     */
    const runner2: GitlabRunnerAutoscalingJobRunnerProps = {
      // protected runner ?
      configuration: {
        token: "gitlab-token2",
        name: "gitlab-runner2",
        machine: {
          maxBuilds: 5, // teardown after 5 jobs
          idleCount: 0, // no instances except for the periods that are set at the autoscaling configuration
          autoscaling: [
            {
              periods: ["* * 13-17 * * *"], // work hours 13-17:00
              idleCount: 1, // 1 hot standby ?
              idleTime: 900, // 15 min idle time
            },
          ],
        },
        docker: {
          privileged: false, // unprivileged
        },
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.SMALL), // t3.medium
    };

    /**
     * Protected runner t3.xlarge, privileged, no hot standby, teardown after 1 job
     */
    const runner3: GitlabRunnerAutoscalingJobRunnerProps = {
      // protected runner ?
      configuration: {
        token: "gitlab-token3",
        name: "gitlab-runner3",
        machine: {
          maxBuilds: 1, // teardown after 1 job
          idleCount: 0, // no hot standby
          autoscaling: [
            {
              idleCount: 0, // no hot standby
              periods: ["* * * * * *"], // always use this configuration
            },
          ],
        },
        // privileged by default
      },
      instanceType: InstanceType.of(InstanceClass.T3, InstanceSize.XLARGE), // t3.xlarge
    };

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        runner1,
        runner2,
        runner3,
        {
          configuration: {
            token: "token4",
            name: "privileged-runner",
          },
          role: privilegedRole,
        },
        {
          configuration: {
            token: "token5",
            name: "restricted-runner",
            docker: {
              privileged: false, // Run unprivileged
            },
          },
          role: restrictedRole,
        },
      ],
    });
  }
}
