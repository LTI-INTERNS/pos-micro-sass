import { Product } from '@/types/product.types';

// ─── Use the canonical Product type (which uses ProductVariant[]) ─────────────
// Previously this file defined its own inline Product type whose variants array
// did NOT include `barcode`. The cast `productsData as unknown as Product[]` in
// product-service.ts hid the mismatch at compile time but the barcode field was
// simply absent at runtime, so ViewProductPopup never rendered it.
//
// Now that we import Product directly from product.types.ts, the variants array
// is typed as ProductVariant[] (which includes barcode?: string) and TypeScript
// will catch any missing fields immediately.

export const productsData: Product[] = [
  {
    id: "001",
    name: "Coca Cola",
    category: "Beverages",
    supplier: "Coca Cola Company",
    description: "Refreshing soft drink",
    price: 100,
    discount: 0,
    tax: 0,
    stock: 50,
    lowstock: 10,

    options: [
      { name: "Size", values: ["500ml", "1L", "2L"] },
    ],

    variants: [
      { sku: "COKE-500", price: 100, barcode: "5000112637922", optionValues: [{ optionName: "Size", value: "500ml" }] },
      { sku: "COKE-1L",  price: 180, barcode: "5000112638012", optionValues: [{ optionName: "Size", value: "1L"    }] },
      { sku: "COKE-2L",  price: 350, barcode: "5000112638029", optionValues: [{ optionName: "Size", value: "2L"    }] },
    ],
  },

  {
    id: "002",
    name: "Chicken Fried Rice",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Hot and spicy fried rice",
    price: 550,
    discount: 0,
    tax: 0,
    stock: 30,
    lowstock: 5,

    options: [
      { name: "Portion", values: ["Regular", "Large"] },
    ],

    variants: [
      { sku: "CFR-REG", price: 550, barcode: "1234567890001", optionValues: [{ optionName: "Portion", value: "Regular" }] },
      { sku: "CFR-LRG", price: 750, barcode: "1234567890002", optionValues: [{ optionName: "Portion", value: "Large"   }] },
    ],
  },

  {
    id: "003",
    name: "Water Bottle 1L",
    category: "Beverages",
    supplier: "Elephant House",
    description: "Pure drinking water",
    price: 80,
    discount: 0,
    tax: 0,
    stock: 100,
    lowstock: 20,

    options: [],

    variants: [
      { sku: "WATER-1L", price: 80, barcode: "4719512002057", optionValues: [] },
    ],
  },

  {
    id: "004",
    name: "Beef Lasagna",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Italian baked pasta",
    price: 750,
    discount: 0,
    tax: 0,
    stock: 20,
    lowstock: 5,

    options: [],

    variants: [
      { sku: "LASAGNA-STD", price: 750, barcode: "9876543210001", optionValues: [] },
    ],
  },

  {
    id: "005",
    name: "Classic Cheeseburger",
    category: "Kitchen Items",
    supplier: "Multiple Suppliers",
    description: "Grilled burger with cheese",
    price: 650,
    discount: 0,
    tax: 0,
    stock: 40,
    lowstock: 8,

    options: [
      { name: "Add-ons", values: ["Extra Cheese", "Bacon"] },
    ],

    variants: [
      { sku: "BURGER-BASE",   price: 650, barcode: "6001234500001", optionValues: [{ optionName: "Add-ons", value: "Extra Cheese" }] },
      { sku: "BURGER-CHEESE", price: 750, barcode: "6001234500002", optionValues: [{ optionName: "Add-ons", value: "Bacon"        }] },
    ],
  },
];