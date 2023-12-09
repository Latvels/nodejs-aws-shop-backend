import * as sdk from "aws-sdk";
import { APIGatewayProxyEvent } from "aws-lambda";
import { responseBuilder } from "../utils/responseBuilder";
import endpoint from '../endpoints.config';

const s3Bucket = new sdk.S3({ region: endpoint.REGION });

exports.handler = async function (event: APIGatewayProxyEvent) {
  const fileName = event.queryStringParameters?.name;
  if (!fileName) return responseBuilder(400, "File name is required");
  // TODO env
  const bucketParams = {
    Bucket: 'rs-aws-import-service',
    Key: `uploaded/${fileName}`,
    Expires: 60,
    ContentType: "text/csv",
  };

  try {
    const signedUrl = await s3Bucket.getSignedUrlPromise(
      "putObject",
      bucketParams
    );
    return responseBuilder(200, signedUrl);
  } catch (Error) {
    return responseBuilder(500, JSON.stringify(Error));
  }
};