import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack, StackProps } from "aws-cdk-lib";
import { PolicyDocument, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

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

    new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          configuration: {
            token: "token1",
            name: "privileged-runner",
          },
          role: privilegedRole,
        },
        {
          configuration: {
            token: "token2",
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
