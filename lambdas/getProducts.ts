import { products } from "../mocks/mocks_data";
import { apiError, apiReply } from "../utils/apiResponses";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event?: APIGatewayProxyEvent) => {
  try {
    if (products.length === 0) return apiError({ statusCode: 404, message: "Product not found" });
    return apiReply({
      statusCode:200,
      body: products,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
  } catch (error: any) {
    return apiError(error);
  }
};