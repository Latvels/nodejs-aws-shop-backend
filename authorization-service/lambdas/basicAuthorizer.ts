import {
  APIGatewayAuthorizerResult,
  Callback,
  CustomAuthorizerResult,
} from "aws-lambda";
import { CustomAuthorizerEvent } from "../ts_types.ts/types";

const generatePolicy = (
  principalId: string,
  effect: string,
  resource: string
): APIGatewayAuthorizerResult => {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        { Action: "execute-api:Invoke", Effect: effect, Resource: resource },
      ],
    },
  };
};

exports.handler = async function (
  event: CustomAuthorizerEvent,
  _context: any,
  callback: Callback<CustomAuthorizerResult>
) {
  console.log("Auth event:", JSON.stringify(event));

  try {
    const authorizationToken = event.authorizationToken;
    if (typeof authorizationToken !== "string" || !authorizationToken) {
      callback("Unauthorized");
      return;
    }
    const encodedCredentails = authorizationToken?.split(" ")[1];
    const buffer = Buffer.from(encodedCredentails as string, "base64");
    const [username, password] = buffer.toString("utf-8").split(":");

    const storedUserPassword = process.env[username];
    const effect =
      !storedUserPassword || storedUserPassword !== password ? "Deny" : "Allow";

    if (effect === "Deny") {
      callback(null, generatePolicy("user", effect, "*"));
      return;
    }

    return callback(null, generatePolicy("user", "Allow", event.methodArn));
  } catch (err: any) {
    console.error("Authorization error: ", err);
    callback("Unauthorized");
  }
};