import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { products } from "../mocks/mocks_data";
import { IStock } from "../ts_types/types";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const dataLenght = 3;

const randomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const computedData = () => {
  const stockForUlpoad: IStock[] = [];
  const productsForUpload = products.slice(0, dataLenght).map((el) => {
    el.id = uuidv4();
    stockForUlpoad.push({
      product_id: el.id,
      count: randomInt(0, 10),
    })
    return el;
  })
  return {productsForUpload, stockForUlpoad}
};

export const uploadDataInTablea = async () => {
  console.log("!", computedData())
  const dataForUpload = computedData();
  for (let i = 0; i < dataLenght; i++) {
    const uploadProduct = new PutCommand({
      TableName: "RS_products",
      Item: dataForUpload.productsForUpload[i],
    });
    const uploadStock = new PutCommand({
      TableName: "RS_stock",
      Item: dataForUpload.stockForUlpoad[i],
    });
    const responseProduct = await docClient.send(uploadProduct);
    console.log("responseProduct", responseProduct);
    const responseStock = await docClient.send(uploadStock);
    console.log("console.log(responseStock);", responseStock);
  }
};
uploadDataInTablea();