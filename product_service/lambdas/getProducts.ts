import { DynamoDB } from 'aws-sdk';
import { APIGatewayProxyEvent } from "aws-lambda";
import { responseBuilder } from "../utils/responseBuilder";

const db = new DynamoDB.DocumentClient();

export const handler = async (event: APIGatewayProxyEvent): Promise<any> => {
  try {
    console.log("getProductsEvent:", JSON.stringify(event));
    const getProducts = await db.scan({TableName: "RS_products"}).promise();
    const getStock = await db.scan({TableName: "RS_stock"}).promise();

    getProducts.Items?.forEach((product) => {
      product.count = getStock.Items?.find((el) => el.product_id === product.id)?.count || 0;
    });
    
    return responseBuilder(200, getProducts.Items as any);
  } catch (dbError) {
    return responseBuilder(500, JSON.stringify(dbError));
  }
};