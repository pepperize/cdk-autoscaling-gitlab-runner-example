const { AwsCdkTypeScriptApp } = require("@pepperize/projen-awscdk-app-ts");
const { javascript } = require("projen");
const project = new AwsCdkTypeScriptApp({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  cdkVersion: "2.278.0",
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

  typescriptVersion: "~6.0",
  minNodeVersion: "22.13.0",
  workflowNodeVersion: "24.x",
  jestOptions: {
    jestVersion: "^30",
  },
  packageManager: javascript.NodePackageManager.YARN_CLASSIC,

  deps: [
    "@pepperize/cdk-autoscaling-gitlab-runner@^0.2.717",
    "@pepperize/cdk-private-bucket@^0.0.599",
    "@pepperize/cdk-security-group@^0.0.662",
    "@pepperize/cdk-vpc@^0.0.1165",
  ],
  devDeps: ["@pepperize/projen-awscdk-app-ts@~0.1.1", "@types/node@^22"],
});

project.synth();
