import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { VpcStack } from "../src/vpc";

test("WithCustomVpcStack", () => {
  const app = new App();
  const stack = new VpcStack(app, "WithCustomVpcStack", {
    gitlabToken: "your gitlab token",
    env: {
      account: "0",
      region: "us-east-1",
    },
  });

  const template = Template.fromStack(stack);

  const capture = new Capture();
  template.hasResourceProperties("AWS::EC2::VPC", capture);
  expect(capture.asObject()).toEqual({
    VpcName: "your-custom-vpc",
  });
  expect(app.synth().getStackArtifact(stack.artifactId).template).toMatchSnapshot();
});
