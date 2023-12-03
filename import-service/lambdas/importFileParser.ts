import * as sdk from "aws-sdk";
import { S3Event } from "aws-lambda";
import { responseBuilder } from "../utils/responseBuilder";
import csvParser from "csv-parser";

const s3Bucket = new sdk.S3({ region: "eu-west-1" });

exports.handler = async function (event: S3Event) {
  console.log("importFileParser:", JSON.stringify(event));
  try {
    for await(const record of event.Records) {
      const params = {
        Bucket: record.s3.bucket.name,
        Key: record.s3.object.key,
      };

      s3Bucket.getObject(params, (err, _) => {
        if (!err) {
          const readFileStream = s3Bucket.getObject(params).createReadStream();
          console.log(`readFile start: ${record.s3.object.key}`);
          fileParseStream(readFileStream, record);
        } else {
          return responseBuilder(500, JSON.stringify(err));
        }
      });
    }
  } catch (Error) {
    return responseBuilder(500, JSON.stringify(Error));
  }
};

async function fileParseStream(
  stream: NodeJS.ReadableStream,
  record: any
) {
  return new Promise((res, rej) => {
    stream
    .pipe(csvParser())
    .on("finish", async () => {
      const { name: bucketName, key } = record.s3.bucket;
      console.log(`${key} stream finish`);
      const folderNames = key.replace("uploaded", "parsed");
      if (key === folderNames) {
        console.log("File is already in parsed folder");
        return res(true);
      }
      try {
        await s3Bucket
          .copyObject({
            CopySource: `${bucketName}/${key}`,
            Bucket: bucketName,
            Key: folderNames,
          })
          .promise();

        await s3Bucket
          .deleteObject({
            Bucket: bucketName,
            Key: key,
          })
          .promise();
        res(true);
      } catch (error: any) {
        console.error("Error: ", error.message);
      }
    })
    .on("error", rej);
  });

};