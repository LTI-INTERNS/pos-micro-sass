export type Product = {
  id: number;
  name: string;
  price: string;
  discount: string;
  tax: number;
  stock: string;
 
};

export const productsData: Product[] = [
  {
    id: 1,
    name: "Nimal",
    price: "Beverages",
    discount: "P01",
    tax: 10,
    stock: "nimal@coca.lk",
    
  },
  {
    id: 2,
    name: "Kamal",
    price: "Beverages",
    discount: "P02",
    tax: 20,
    stock: "kamal@coca.lk",
    
  },
];