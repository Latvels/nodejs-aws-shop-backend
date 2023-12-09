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