import { responseBuilder } from "../utils/responseBuilder";
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

    if (!product.Item) return responseBuilder(404, { status: 404, message: "Product not found" });
    
    const mergeTables = {
      ...product.Item,
      count: stock?.Item?.count || 0,
    };

    return responseBuilder(200, mergeTables);
    } catch (Error) {
      return responseBuilder(500, JSON.stringify(Error));
    }
};