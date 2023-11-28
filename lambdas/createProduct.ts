import { apiReply } from "../utils/apiResponses";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';

const db = new DynamoDB.DocumentClient();

const productSchema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().positive().integer().required(),
});

const stockSchema = yup.object({
  count: yup.number().integer().min(0).required(),
});

export const handler = async (event?: APIGatewayProxyEvent | any) => {
  try {
    console.log("CreateProduct:", JSON.stringify(event));
    if (!event.body) {
      return { statusCode: 400, body: 'invalid request, you are missing the parameter body' };
    }
    const data = typeof event.body == 'object' ? event.body : JSON.parse(event.body);
    const { count, ...productData } = data;

    const validateProductData = await productSchema.validate(productData);
    const validateStockData = await stockSchema.validate({ count });

    const productId = uuidv4();
    
    const newProduct = {
      TableName: "RS_products",
      Item: { id: productId, ...validateProductData },
    };

    const newStock = {
      TableName: "RS_stock",
      Item: { product_id: productId, ...validateStockData },
    };
  
    db.transactWrite({
      TransactItems: [{ Put: newProduct }, { Put: newStock }],
    })
    .promise();
    // await db.put(newProduct).promise();
    // await db.put(newStock).promise();

    return apiReply({
      statusCode: 200, 
      body: { ...newProduct.Item, ...newStock.Item }, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    });
    } catch (dbError) {
      if (dbError instanceof yup.ValidationError) {
        return { statusCode: 400, body: dbError.errors.join("; "), headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        }, };
      } else {
        return { statusCode: 500, body: JSON.stringify(dbError), headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        }, };
      }
    }
};