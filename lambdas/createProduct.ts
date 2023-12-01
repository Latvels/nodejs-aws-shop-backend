import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDB } from 'aws-sdk';
import * as yup from "yup";
import { v4 as uuidv4 } from 'uuid';
import { responseBuilder } from "../utils/responseBuilder";

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
      return responseBuilder(400, { message: 'invalid request, you are missing the parameter body'});
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
  
    await db.transactWrite({
      TransactItems: [{ Put: newProduct }, { Put: newStock }],
    })
    .promise();

    return responseBuilder(200, { ...newProduct.Item, ...newStock.Item });
    } catch (Error) {
      if (Error instanceof yup.ValidationError) {
        return responseBuilder(400, Error.errors.join("; "));
      } else {
        return responseBuilder(500, JSON.stringify(Error));
      }
    }
};