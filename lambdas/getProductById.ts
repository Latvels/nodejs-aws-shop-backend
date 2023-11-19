import { products } from "../mocks/mocks_data";
import { apiReply, apiError } from "../utils/apiResponses";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event?: APIGatewayProxyEvent | any) => {
  try {
    if (!event?.pathParameters?.product_id || !Number(event?.pathParameters?.product_id))
      return apiError({ statusCode: 402, message: "Product id not specified or not valid" });

    let requestedProduct = products.filter((el) => Number(el.id) === Number(event?.pathParameters?.product_id));

    if (requestedProduct.length === 0) return apiError({ statusCode: 404, message: "Product not found" });
    return apiReply({
      statusCode: 200, 
      body: requestedProduct, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
  } catch (error: any) {
    return apiError(error);
  }
};