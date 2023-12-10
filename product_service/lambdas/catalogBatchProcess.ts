import * as sdk from "aws-sdk";
import { SQSEvent } from "aws-lambda";
import { responseBuilder } from "../utils/responseBuilder";
import { createProduct } from "../utils/createProduct";

const sns = new sdk.SNS();

exports.handler = async function (event: SQSEvent) {
  try {
    const newProducts = [];
    for (const record of event.Records) {
      try {
        const body = JSON.parse(record.body);
        const { count, ...productData } = body;
        const newProduct = await createProduct(productData, count);
        newProducts.push(newProduct);
      } catch (error: any) {
        console.error("Error while processing record:", error);
      }
    }

    const SNSParams = {
      Message: `The new products have been created.\r\n${JSON.stringify(
        newProducts
      )}`,
      Subject: "Creation of batch products is completed",
      TopicArn: process.env.SNS_TOPIC_ARN,//
    };

    await sns.publish(SNSParams).promise();

    return responseBuilder(200, "message is delivered");
  } catch (err: any) {
    return responseBuilder(500, err.message);
  }
};