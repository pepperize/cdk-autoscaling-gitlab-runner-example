import {
  GitlabRunnerAutoscaling,
  GitlabRunnerAutoscalingJobRunnerProps,
} from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack, StackProps } from "aws-cdk-lib";
import { InstanceClass, InstanceSize, InstanceType } from "aws-cdk-lib/aws-ec2";
import { PolicyDocument, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { ParameterTier, ParameterType, StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";

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

    const token1 = new StringParameter(this, "auth-token-1", {
      parameterName: "/gitlab-runner/token1",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });
    const token2 = new StringParameter(this, "auth-token-2", {
      parameterName: "/gitlab-runner/token2",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });
    const token3 = new StringParameter(this, "auth-token-3", {
      parameterName: "/gitlab-runner/token3",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });
    const token4 = new StringParameter(this, "auth-token-4", {
      parameterName: "/gitlab-runner/token4",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });
    const token5 = new StringParameter(this, "auth-token-5", {
      parameterName: "/gitlab-runner/token5",
      stringValue: "auth-token",
      type: ParameterType.SECURE_STRING,
      tier: ParameterTier.STANDARD,
    });

    /**
     * Unprotected runner t3.medium unprivileged work hours 10-18:00, 30 min idle time, teardown after 20 jobs, 1 hot standby
     */
    const runner1: GitlabRunnerAutoscalingJobRunnerProps = {
      // should be set to **unprotected** at gitlab web interface
      token: token1,
      configuration: {
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
      // should be set to **protected** at gitlab web interface
      token: token2,
      configuration: {
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
      // should be set to **protected** at gitlab web interface
      token: token3,
      configuration: {
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
          token: token4,
          configuration: {
            token: "token4",
            name: "privileged-runner",
          },
          role: privilegedRole,
        },
        {
          token: token5,
          configuration: {
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
