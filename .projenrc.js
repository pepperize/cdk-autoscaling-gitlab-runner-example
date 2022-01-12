const { awscdk, javascript } = require("projen");
const project = new awscdk.AwsCdkTypeScriptApp({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  authorOrganization: true,
  copyrightOwner: "Pepperize UG (haftungsbeschränkt)",
  license: "MIT",
  cdkVersion: "1.114.0",
  defaultReleaseBranch: "main",
  name: "@pepperize/cdk-autoscaling-gitlab-runner-example",
  keywords: [
    "AWS",
    "CDK",
    "GitLab",
    "Runner",
    "Autoscaling",
    "EC2",
    "Spot Instances",
    "Docker Machine",
    "Executor",
    "Docker in Docker",
    "S3",
    "Shared Cache",
  ],
  repositoryUrl: "https://github.com/pepperize/cdk-autoscaling-gitlab-runner-example.git",

  cdkDependencies: ["@aws-cdk/aws-s3", "@aws-cdk/aws-ec2", "@aws-cdk/aws-iam", "@aws-cdk/assertions"],
  deps: ["@pepperize/cdk-autoscaling-gitlab-runner"],

  autoApproveUpgrades: true,
  autoApproveOptions: { allowedUsernames: ["pflorek"], secret: "GITHUB_TOKEN" },
  depsUpgradeOptions: {
    workflowOptions: {
      secret: "PROJEN_GITHUB_TOKEN",
    },
  },

  npmAccess: javascript.NpmAccess.PUBLIC,
  packageManager: javascript.NodePackageManager.YARN,

  eslint: true,
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
    },
  },
  jestOptions: {
    jestConfig: {
      testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)@(spec|test).[tj]s?(x)"],
    },
  },

  gitignore: [".idea"],
});

project.setScript("format", "prettier --write src/**/*.ts test/**/*.ts .projenrc.js README.md");

project.synth();
