import { Capture, Template } from "@aws-cdk/assertions";
import { App } from "@aws-cdk/core";
import { CacheBucketStack } from "../src/cache";

describe("WithCustomCacheBucketStack", () => {
  it("Should have custom cache bucket", () => {
    // Given
    const app = new App();
    const stack = new CacheBucketStack(app, "WithCustomCacheBucketStack", {
      gitlabToken: "your gitlab token",
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
      gitlabToken: "your gitlab token",
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
