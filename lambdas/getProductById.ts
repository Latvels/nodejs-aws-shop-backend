import { apiReply, apiError } from "../utils/apiResponses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
const db = new DynamoDB.DocumentClient();

export const handler = async (event?: APIGatewayProxyEvent | any) => {
  try {
    console.log("getProductById:", JSON.stringify(event));

    const product_id = event?.pathParameters?.product_id;

    const productParams = {
      TableName: "RS_products",
      Key: {
        id: product_id
      }
    };
    const stocksParams = {
      TableName: "RS_stock",
      Key: {
        product_id: product_id,
      },
    };
    const product = await db.get(productParams).promise();
    const stock = await db.get(stocksParams).promise();

    if (!product) {
      return apiReply({
        statusCode: 404,
        body: "Product not found",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      });
    }
    
    const mergeTables = {
      ...product.Item,
      count: stock?.Item?.count || 0,
    };

    return apiReply({
      statusCode: 200, 
      body: mergeTables, 
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