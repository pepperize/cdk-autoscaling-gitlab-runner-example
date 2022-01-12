import { Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { ZeroConfigStack } from "../src/zero-config";

describe("ZeroConfigStack", () => {
  it("Should have custom cache bucket", () => {
    // Given
    const app = new App();

    // When
    const stack = new ZeroConfigStack(app, "ZeroConfigStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::S3::Bucket", {});
    template.hasResourceProperties("AWS::EC2::VPC", {});
    template.hasResourceProperties("AWS::AutoScaling::AutoScalingGroup", {});
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();

    // When
    const stack = new ZeroConfigStack(app, "ZeroConfigStack", {
      gitlabToken: "your gitlab token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // Then
    const template = Template.fromStack(stack);
    expect(template).toMatchSnapshot();
  });
});
