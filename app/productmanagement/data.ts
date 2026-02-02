export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  tax: number;
  stock: number;
};

export const productsData: Product[] = [
  { id: 1, name: "Item A", price: 1000, discount: 0, tax: 15, stock: 20 },
  { id: 2, name: "Item B", price: 1250, discount: 5, tax: 12, stock: 35 },
  { id: 3, name: "Item C", price: 850, discount: 0, tax: 10, stock: 50 },
  { id: 4, name: "Item D", price: 1990, discount: 10, tax: 15, stock: 12 },
  { id: 5, name: "Item E", price: 450, discount: 0, tax: 8, stock: 120 },
  { id: 6, name: "Item F", price: 2750, discount: 15, tax: 18, stock: 7 },
  { id: 7, name: "Item G", price: 990, discount: 0, tax: 12, stock: 60 },
  { id: 8, name: "Item H", price: 1490, discount: 5, tax: 14, stock: 28 },
  { id: 9, name: "Item I", price: 520, discount: 0, tax: 5, stock: 200 },
  { id: 10, name: "Item J", price: 3100, discount: 20, tax: 18, stock: 5 },
  { id: 11, name: "Item K", price: 670, discount: 0, tax: 10, stock: 80 },
  { id: 12, name: "Item L", price: 2150, discount: 12, tax: 16, stock: 18 },
  { id: 13, name: "Item M", price: 1340, discount: 0, tax: 12, stock: 42 },
  { id: 14, name: "Item N", price: 780, discount: 3, tax: 9, stock: 95 },
  { id: 15, name: "Item O", price: 5600, discount: 25, tax: 18, stock: 3 },
];
