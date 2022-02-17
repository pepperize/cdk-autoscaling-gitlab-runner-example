import { Annotations, App } from "aws-cdk-lib";
import { CacheBucketStack } from "./cache";
import { DockerMachineStack } from "./docker-machine";
import { InstanceTypeStack } from "./instance-type";
import { MachineImageStack } from "./machine-image";
import { MultipleRunnersStack } from "./multiple-runners";
import { OnDemandInstancesStack } from "./on-demand-instances";
import { RunnersRoleStack } from "./runner-role";
import { RunnerStackProps } from "./runner-stack-props";
import { VpcStack } from "./vpc";
import { ZeroConfigStack } from "./zero-config";

// for development, use account/region from cdk cli
const devEnv = {
  account: "069388652156", // process.env.CDK_DEFAULT_ACCOUNT || "069388652156"
  region: "us-east-1", // process.env.CDK_DEFAULT_REGION || "us-east-1"
};

const app = new App();

const gitlabToken = process.env.GITLAB_TOKEN!;
if (!gitlabToken) {
  Annotations.of(app).addWarning("Gitlab Runner authorization token is missing! \n Export env var GITLAB_TOKEN");
}

const props: RunnerStackProps = { gitlabToken: "" + gitlabToken, env: devEnv };

new CacheBucketStack(app, "CacheBucketStack", props);
new DockerMachineStack(app, "DockerMachineStack", props);
new InstanceTypeStack(app, "InstanceTypeStack", props);
new MachineImageStack(app, "MachineImageStack", props);
new MultipleRunnersStack(app, "MultipleRunnersStack", props);
new OnDemandInstancesStack(app, "OnDemandInstancesStack", props);
new RunnersRoleStack(app, "RunnersRoleStack", props);
new VpcStack(app, "VpcStack", props);
new ZeroConfigStack(app, "ZeroConfigStack", props);

app.synth();
