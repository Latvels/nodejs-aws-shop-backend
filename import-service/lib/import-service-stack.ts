import { Construct } from "constructs";
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import endpoint from '../endpoints.config';

export class ImportServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const s3Bucket = new s3.Bucket(this, "importServiceBucket", {
      bucketName: process.env.BUCKET_NAME,
      versioned: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    
    const sharedLambdaProps: NodejsFunctionProps = {
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        externalModules: ["aws-sdk"],
      },
    };

    const importProductLambda = new NodejsFunction(this, "importProductFile", {
      entry: "lambdas/importProductsFile.ts",
      ...sharedLambdaProps,
    });
    const importProductIntegration = new apigateway.LambdaIntegration(importProductLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    s3Bucket.grantPut(importProductLambda);

    const importParseLambda = new NodejsFunction(this, "importParseFile", {
      entry: "lambdas/importFileParser.ts",
      ...sharedLambdaProps,
    });
    
    s3Bucket.grantPut(importParseLambda);

    s3Bucket.addEventNotification(
      s3.EventType.OBJECT_CREATED,
      new cdk.aws_s3_notifications.LambdaDestination(importParseLambda),
      { prefix: "uploaded/" }
    );

    const api = new apigateway.LambdaRestApi(this, "importProductApi", {
      handler: importProductLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["*"],
      },
    });

    const routes = api.root.addResource('import');
    routes.addMethod('GET', importProductIntegration);

  }
}