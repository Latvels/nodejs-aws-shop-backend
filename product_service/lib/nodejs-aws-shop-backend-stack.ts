import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam"
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
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        externalModules: ["aws-sdk"],
      },
    };

    const getProductsLambda = new NodejsFunction(this, "getProducts", {
      entry: "lambdas/getProducts.ts",
      ...sharedLambdaProps,
    });
    const getProductsIntegration = new apigateway.LambdaIntegration(getProductsLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    const getProductsByIdLambda = new NodejsFunction(this, "getProductById", {
      entry: "lambdas/getProductById.ts",
      ...sharedLambdaProps,
    });
    const getProductsByIdIntegration = new apigateway.LambdaIntegration(getProductsByIdLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });
    const createProductLambda = new NodejsFunction(this, "createProduct", {
      entry: "lambdas/createProduct.ts",
      ...sharedLambdaProps,
    });
    const createProductIntegration = new apigateway.LambdaIntegration(createProductLambda, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    const dynamoDBPolicy = new iam.PolicyStatement({
      actions: ["dynamodb:Scan", "dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
      resources: ["*"],
    })
    
    getProductsLambda.addToRolePolicy(dynamoDBPolicy);
    getProductsByIdLambda.addToRolePolicy(dynamoDBPolicy);
    createProductLambda.addToRolePolicy(dynamoDBPolicy);
    
    const api = new apigateway.LambdaRestApi(this, "nodejs-aws-shop-backend-api", {
      handler: getProductsLambda,
      proxy: false,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["*"],
      },
    });

    const products = api.root.addResource('products');
    products.addMethod('GET', getProductsIntegration);
    const getProductById = products.addResource('{product_id}');
    getProductById.addMethod('GET', getProductsByIdIntegration);
    products.addMethod('POST', createProductIntegration);
  }
}
