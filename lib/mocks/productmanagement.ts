export type Product = {
  id: string;
  name: string;
  category: string;
  supplier: string;
  description?: string;

  variants: {
    sku: string;
    price: number;
    imageUrl?: string;
  }[];

  options: {
    name: string;
    values: string[];
  }[];
};

export const productsData: Product[] = [
  {
    id: "001",
    name: "Coca Cola",
    category: "Beverages",
    supplier: "Coca Cola Company",
    description: "Refreshing soft drink",

    options: [
      { name: "Size", values: ["500ml", "1L", "2L"] }
    ],

    variants: [
      { sku: "COKE-500", price: 100 },
      { sku: "COKE-1L", price: 180 },
      { sku: "COKE-2L", price: 350 }
    ],
  },

  {
    id: "002",
    name: "Chicken Fried Rice",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Hot and spicy fried rice",

    options: [
      { name: "Portion", values: ["Regular", "Large"] }
    ],

    variants: [
      { sku: "CFR-REG", price: 550 },
      { sku: "CFR-LRG", price: 750 }
    ],
  },

  {
    id: "003",
    name: "Water Bottle 1L",
    category: "Beverages",
    supplier: "Elephant House",
    description: "Pure drinking water",

    options: [],

    variants: [
      { sku: "WATER-1L", price: 80 }
    ],
  },

  {
    id: "004",
    name: "Beef Lasagna",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Italian baked pasta",

    options: [],

    variants: [
      { sku: "LASAGNA-STD", price: 750 }
    ],
  },

  {
    id: "005",
    name: "Classic Cheeseburger",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Grilled burger with cheese",

    options: [
      { name: "Add-ons", values: ["Extra Cheese", "Bacon"] }
    ],

    variants: [
      { sku: "BURGER-BASE", price: 650 },
      { sku: "BURGER-CHEESE", price: 750 }
    ],
  },
];