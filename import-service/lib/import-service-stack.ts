import * as cdk from 'aws-cdk-lib';
import { aws_s3 as s3 } from 'aws-cdk-lib';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'RS_ImportService', {
      versioned: false,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    // bucket.grantReadWrite(myLambda);
  }
}