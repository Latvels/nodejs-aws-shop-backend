export interface IProduct {
  title: string,
  id: string,
  price: number,
  description: string,
};

export interface IStock {
  product_id: string,
  count: number,
}
// TODO: IReply remove any type
export interface IReply {
  statusCode?: number,
  body?: IProduct[] | string | object,
  headers?: any,
};

export interface IError {
  statusCode?: number,
  message?: string,
  stack?: string,
  headers?: any,
};