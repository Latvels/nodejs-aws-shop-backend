export const responseBuilder = (
  statusCode: number,
  body: Object[] | Object,
  headers?: Object,
) => {
  return {
  statusCode,
  body: JSON.stringify(body),
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": true,
    ...headers
    },
  };
};