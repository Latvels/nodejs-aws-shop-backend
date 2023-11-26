import { DynamoDB } from 'aws-sdk';

const db = new DynamoDB.DocumentClient();

export const handler = async (): Promise<any> => {

  try {
    const getProducts = await db.scan({TableName: "RS_products"}).promise();
    const getStock = await db.scan({TableName: "RS_stock"}).promise();

    getProducts.Items?.forEach((product) => {
      product.count = getStock.Items?.find((el) => el.product_id === product.id)?.count || 0;
    });

    return { statusCode: 200, body: JSON.stringify(getProducts.Items), headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }, };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError), headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    }, };
  }
};