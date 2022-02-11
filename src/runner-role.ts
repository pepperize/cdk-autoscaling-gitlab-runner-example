import { GitlabRunnerAutoscaling } from "@pepperize/cdk-autoscaling-gitlab-runner";
import { Stack } from "aws-cdk-lib";
import { ManagedPolicy, PolicyDocument, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";
import { RunnerStackProps } from "./runner-stack-props";

export interface WithCustomRunnersRoleProps extends RunnerStackProps {}

export class RunnersRoleStack extends Stack {
  constructor(scope: Construct, id: string, props: WithCustomRunnersRoleProps) {
    super(scope, id, props);

    const { gitlabToken } = props;

    /**
     * Set role (override default runners role)
     */
    const role = new Role(this, "CustomRunnersRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      inlinePolicies: {
        CdkDeploy: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: [
                "cloudformation:DescribeStacks",
                "cloudformation:CreateChangeSet",
                "cloudformation:DescribeChangeSet",
                "cloudformation:ExecuteChangeSet",
                "cloudformation:DescribeStackEvents",
                "cloudformation:DeleteChangeSet",
                "cloudformation:GetTemplate",
              ],
              Resource: ["*"],
            },
            {
              Effect: "Allow",
              Action: ["s3:*Object", "s3:ListBucket", "s3:GetBucketLocation"],
              Resource: ["arn:aws:s3:::cdktoolkit-*"],
            },
          ],
        }),
        CfnDeploy: PolicyDocument.fromJson({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: ["*"],
              Resource: ["*"],
              Condition: {
                "ForAnyValue:StringEquals": {
                  "aws:CalledVia": "cloudformation.amazonaws.com",
                },
              },
            },
          ],
        }),
      },
    });

    const runner = new GitlabRunnerAutoscaling(this, "Runner", {
      runners: [
        {
          role: role,
          configuration: {
            token: gitlabToken,
            name: "gitlab-runner-with-custom-role",
          },
        },
      ],
    });

    /**
     * Add role to runners instance profile
     */
    const roleForS3FullAccess = new Role(this, "RunnersInstanceRole", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com", {}),
      managedPolicies: [
        ManagedPolicy.fromManagedPolicyArn(this, "AmazonS3FullAccess", "arn:aws:iam::aws:policy/AmazonS3FullAccess"),
      ],
    });

    runner.runners[0].instanceProfile.roles.push(roleForS3FullAccess.roleName);
  }
}
