export interface IProduct {
  title: string,
  id: string,
  price: number,
  description: string,
};
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