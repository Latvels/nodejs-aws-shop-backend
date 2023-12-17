import * as cdk from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam"
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as sns from "aws-cdk-lib/aws-sns";
import * as subscriptions from "aws-cdk-lib/aws-sns-subscriptions";
import * as lambdaEventSources from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";
import * as dotenv from "dotenv";
dotenv.config();

export class NodejsAwsShopBackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Dynamo BD
    const productsTable = new dynamodb.TableV2(this, 'PRODUCTS_TABLE', {
      tableName: process.env.PRODUCT_TABLE as string,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.provisioned({
        readCapacity: dynamodb.Capacity.fixed(5),
        writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 5 }),
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });
    const stocksTable = new dynamodb.TableV2(this, 'STOCKS_TABLE', {
      tableName: process.env.STOCK_TABLE as string,
      partitionKey: { name: 'product_id', type: dynamodb.AttributeType.STRING },
      billing: dynamodb.Billing.provisioned({
        readCapacity: dynamodb.Capacity.fixed(5),
        writeCapacity: dynamodb.Capacity.autoscaled({ maxCapacity: 5 }),
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // sqs
    const catalogItemsQueue = new sqs.Queue(this, "CatalogItemsQueue", {
      queueName: "catalog-items-queue",
      visibilityTimeout: cdk.Duration.seconds(10),
    });

    const createProductTopic = new sns.Topic(this, "CreateProductTopic", {
      topicName: "PRODUCT-TOPIC",
      displayName: "product-creation-topic",
    });

    createProductTopic.addSubscription(
      new subscriptions.EmailSubscription(
        process.env.SUBSCRIPTION_EMAIL as string
      )
    );




    // Lambdas
    const sharedLambdaProps: NodejsFunctionProps = {
      environment: {
        PRODUCTS_TABLE_NAME: productsTable.tableName,
        STOCKS_TABLE_NAME: stocksTable.tableName,
        SNS_TOPIC_ARN: createProductTopic.topicArn,
      },
      runtime: lambda.Runtime.NODEJS_16_X,
      bundling: {
        minify: true,
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

    const catalogBatchProcessLambda = new NodejsFunction(
      this,
      "catalogBatchProcess",
      {
        entry: "lambdas/catalogBatchProcess.ts",
        ...sharedLambdaProps,
        timeout: cdk.Duration.seconds(5),
      }
    );

    const dynamoDBPolicy = new iam.PolicyStatement({
      actions: ["dynamodb:Scan", "dynamodb:Query", "dynamodb:GetItem", "dynamodb:PutItem"],
      resources: ["*"],
    })
    // access
    getProductsLambda.addToRolePolicy(dynamoDBPolicy);
    getProductsByIdLambda.addToRolePolicy(dynamoDBPolicy);
    createProductLambda.addToRolePolicy(dynamoDBPolicy);
    
    productsTable.grantReadWriteData(getProductsLambda);
    productsTable.grantReadWriteData(getProductsByIdLambda);
    productsTable.grantReadWriteData(createProductLambda);

    stocksTable.grantReadWriteData(getProductsLambda);
    stocksTable.grantReadWriteData(getProductsByIdLambda);
    stocksTable.grantReadWriteData(createProductLambda);

    catalogItemsQueue.grantConsumeMessages(catalogBatchProcessLambda);

    catalogBatchProcessLambda.role?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonDynamoDBFullAccess")
    );
    catalogBatchProcessLambda.addEventSource(
      new lambdaEventSources.SqsEventSource(catalogItemsQueue, { batchSize: 5 })
    );

    createProductTopic.grantPublish(catalogBatchProcessLambda);

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
