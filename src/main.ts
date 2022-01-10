import { App } from "@aws-cdk/core";
import { CacheBucketStack } from "./cache";
import { DockerMachineStack } from "./docker-machine";
import { InstanceTypeStack } from "./instance-type";
import { MachineImageStack } from "./machine-image";
import { OnDemandInstancesStack } from "./on-demand-instances";
import { RunnersRoleStack } from "./runner-role";
import { RunnerStackProps } from "./runner-stack-props";
import { VpcStack } from "./vpc";
import { ZeroConfigStack } from "./zero-config";

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT || "123456798012",
  region: process.env.CDK_DEFAULT_REGION || "us-east-1",
};

const gitlabToken = process.env.GITLAB_TOKEN!;

const app = new App();

const props: RunnerStackProps = { gitlabToken: gitlabToken, env: devEnv };

new CacheBucketStack(app, "CacheBucketStack", props);
new DockerMachineStack(app, "DockerMachineStack", props);
new InstanceTypeStack(app, "InstanceTypeStack", props);
new MachineImageStack(app, "MachineImageStack", props);
new OnDemandInstancesStack(app, "OnDemandInstancesStack", props);
new RunnersRoleStack(app, "RunnersRoleStack", props);
new VpcStack(app, "VpcStack", props);
new ZeroConfigStack(app, "ZeroConfigStack", props);

app.synth();
