import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
// import * as dotenv from "dotenv";
import 'dotenv/config'
// dotenv.config();

export class AuthorizationServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sharedLambdaProps: NodejsFunctionProps = {
      environment: { Latvels: process.env.Latvels as string },
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        minify: true,
        externalModules: ["aws-sdk"],
      },
    };

    new NodejsFunction(this, "basicAuthorizer", {
      entry: "lambdas/basicAuthorizer.ts",
      ...sharedLambdaProps,
    });

  }
}
