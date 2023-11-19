export interface IProduct {
  title: string,
  id: string,
  price: number,
  description: string,
};

export interface IReply {
  statusCode?: number,
  body?: IProduct[] | string | object,
};

export interface IError {
  statusCode?: number,
  message?: string,
  stack?: string,
};