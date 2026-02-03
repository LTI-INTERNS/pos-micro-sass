export type Product = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  discount: number;
  tax: number;
  stock: string;
  lowstock: string;
};

export const productsData: Product[] = [
  {
    id: "001",
    name: "Coca Cola",
    category: "Beverages",
    supplier: "Coca Cola Company",
    price: 100,
    discount: 5,
    tax: 10,
    stock: "100",
    lowstock: "10",
  },
  {
    id: "002",
    name: "Chicken Fried Rice",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    price: 550,
    discount: 5,
    tax: 10,
    stock: "In Stock",
    lowstock: "Available",
  },
  {
    id: "003",
    name: "Water Bottle 1L",
    category: "Beverages",
    supplier: "Elephent House",  
    price: 80,
    discount: 5,
    tax: 10,
    stock: "20",
    lowstock: "10",
  },
  {
    id: "004",
    name: "Beef Lasagna",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    price: 750,
    discount: 5,
    tax: 10,
    stock: "In Stock",
    lowstock: "Available",
  },
  {
    id: "005",
    name: "Classic Cheeseburger",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    price: 650,
    discount: 5,
    tax: 10,
    stock: "In Stock",
    lowstock: "Available",
  }, 
];
