import * as AWS from "aws-sdk";
import { v4 as uuid } from "uuid";
import { productSchema, stockSchema } from "../mocks/mocks_data";
import { IProduct } from "../ts_types/types";

const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function createProduct(productData: IProduct, count: number) {
  const validatedProductData = await productSchema.validate(productData);
  const validatedStockData = await stockSchema.validate({ count });
  const newProductId = uuid();

  const newProduct = {
    TableName: process.env.PRODUCTS_TABLE_NAME as string,
    Item: { id: newProductId, ...validatedProductData },
  };

  const newProductStock = {
    TableName: process.env.STOCKS_TABLE_NAME as string,
    Item: { product_id: newProductId, count: validatedStockData.count },
  };

  await dynamoDB
    .transactWrite({
      TransactItems: [{ Put: newProduct }, { Put: newProductStock }],
    })
    .promise();

  return { ...newProduct.Item, ...newProductStock.Item };
}