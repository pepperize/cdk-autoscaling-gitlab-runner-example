const { AwsCdkTypeScriptApp } = require("@pepperize/projen-awscdk-app-ts");
const project = new AwsCdkTypeScriptApp({
  authorName: "Ivan Ovdiienko",
  authorAddress: "ivan.ovdiienko@pepperize.com",
  cdkVersion: "2.8.0",
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

  deps: [
    "@pepperize/cdk-autoscaling-gitlab-runner",
    "@pepperize/cdk-private-bucket",
    "@pepperize/cdk-security-group",
    "@pepperize/cdk-vpc",
  ],
  devDeps: ["@pepperize/projen-awscdk-app-ts"],
});

project.synth();
