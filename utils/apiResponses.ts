import { IReply, IError } from "../ts_types/types";

export const apiReply = (reply: IReply) => {
  return {
    statusCode: reply.statusCode,
    body: JSON.stringify(reply.body),
    headers: reply.headers,
  };
};

export const apiError = (error: IError) => {
  return {
    statusCode: error.statusCode,
    message: JSON.stringify(error.message),
    stack: error.stack,
    headers: error?.headers,
  }
};