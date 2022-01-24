import { StackProps } from "aws-cdk-lib";

export interface RunnerStackProps extends StackProps {
  readonly gitlabToken: string;
}
