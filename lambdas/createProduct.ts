import { apiReply } from "../utils/apiResponses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
import * as AWS from "aws-sdk";
import { v4 as uuidv4 } from 'uuid';

const db = new DynamoDB.DocumentClient();

export const handler = async (event?: APIGatewayProxyEvent | any) => {
  try {
    console.log("CreateProduct:", JSON.stringify(event));
    if (!event.body) {
      return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
    }
    const data = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    const { count, ...productData } = data;

    const productId = uuidv4();
    
    const newProduct = {
      TableName: "RS_products",
      Item: { id: productId, ...productData },
    };

    const newStock = {
      TableName: "RS_stock",
      Item: { product_id: productId, count },
    };
  
    await db.put(newProduct).promise();
    await db.put(newStock).promise();

    return apiReply({
      statusCode: 200, 
      body: { ...newProduct.Item, ...newStock.Item }, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
    } catch (dbError) {
      return { statusCode: 500, body: JSON.stringify(dbError), headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      }, };
    }
};