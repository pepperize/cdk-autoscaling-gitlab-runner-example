import { App } from "aws-cdk-lib";
import { Capture, Template } from "aws-cdk-lib/assertions";
import { CacheBucketStack } from "../src/cache";

describe("WithCustomCacheBucketStack", () => {
  it("Should have custom cache bucket", () => {
    // Given
    const app = new App();
    const stack = new CacheBucketStack(app, "WithCustomCacheBucketStack", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    const capture = new Capture();
    template.hasResourceProperties("AWS::S3::Bucket", capture);
    expect(capture.asObject()).toEqual({
      BucketName: "your-custom-bucket",
    });
  });

  it("Should match snapshot", () => {
    // Given
    const app = new App();
    const stack = new CacheBucketStack(app, "WithCustomCacheBucketStack", {
      gitlabToken: "token",
      env: {
        account: "0",
        region: "us-east-1",
      },
    });

    // When
    const template = Template.fromStack(stack);

    // Then
    expect(template).toMatchSnapshot();
  });
});
