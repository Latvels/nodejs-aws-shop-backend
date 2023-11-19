import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const sharedLambdaProps: NodejsFunctionProps = {
      environment: {},
      runtime: lambda.Runtime.NODEJS_18_X,
      bundling: {
        externalModules: ["aws-sdk"],
      },
    };

    const getProductsLambda = new NodejsFunction(this, "getProducts", {
      entry: "lambdas/getProducts.ts",
      ...sharedLambdaProps,
    });
    const getProductsByIdLambda = new NodejsFunction(this, "getProductById", {
      entry: "lambdas/getProductById.ts",
      ...sharedLambdaProps,
    });

    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    const getProductsByIdIntegration = new apigateway.LambdaIntegration(getProductsByIdLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const api = new apigateway.LambdaRestApi(this, "widgets-api", {
      handler: getProductsLambda,
      proxy: false,
    });

    const getProducts = api.root.addResource('products');
    getProducts.addMethod('GET', getProductsIntegration);
    const getProductById = getProducts.addResource('{product_id}');
    getProductById.addMethod('GET', getProductsByIdIntegration);
  }
}