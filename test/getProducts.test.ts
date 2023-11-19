import { handler } from '../lambdas/getProducts';
import { IReply } from "../ts_types/types";

describe('Unit test for getProducts handler', function () {
  test('Is req ok and state 200', async () => {
    const { statusCode }:IReply = await handler();
    expect(statusCode).toEqual(200);
  });

  test('Is product in body not equal 0', async () => {
    const { body }:IReply = await handler();
    expect(JSON.parse(body as string).length).not.toBeLessThan(0)
  });
});