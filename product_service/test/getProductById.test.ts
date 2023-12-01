import { handler } from '../lambdas/getProductById';
import { IReply, IError } from "../ts_types/types";

describe('Unit test for getProductById handler', function () {
  test('Is product_id valid', async () => {
    const req = { pathParameters: { product_id : 2 } };
    const { statusCode, body }:IReply = await handler(req);
    expect(statusCode).toEqual(200);
    expect(JSON.parse(body as string).length).not.toBeLessThan(0)
  });

  test('Is product_id not specified or not valid', async () => {
    const req = { pathParameters: {} };
    const { statusCode, message }:IError = await handler(req);
    expect(statusCode).toEqual(404);
    expect(message).toEqual("Product id not specified or not valid");
  });

  test('Is product_id valid and no found product', async () => {
    const req = { pathParameters: { product_id : 9999 } };
    const { statusCode, message }:IError = await handler(req);
    expect(statusCode).toEqual(404);
    expect(message).toEqual("Product not found");
  });
});
