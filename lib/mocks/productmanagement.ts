import { Product } from '@/types/product.types';

// ─── Branch variant data shape ────────────────────────────────────────────────

export type BranchVariantDetail = {
  stockQty: number;
  stockUnit: string;
  basePriceOverride?: number;
  sellingPriceOverride?: number;
  discount?: number;       // percentage
  taxRate?: number;        // percentage
  lowStock?: number;
  available: boolean;
  supplier: string | null; // per-branch supplier for this variant
};

// Keyed by branchName → sku → BranchVariantDetail
export type BranchStock = Record<string, Record<string, BranchVariantDetail>>;

// Extended product that carries branch data
export type ProductWithBranches = Product & { branchStock?: BranchStock };

// ─── Mock data ────────────────────────────────────────────────────────────────

export const productsData: ProductWithBranches[] = [
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
    options: [{ name: "Size", values: ["500ml", "1L", "2L"] }],
    variants: [
      { sku: "COKE-500", price: 100, barcode: "5000112637922", optionValues: [{ optionName: "Size", value: "500ml" }] },
      { sku: "COKE-1L",  price: 180, barcode: "5000112638012", optionValues: [{ optionName: "Size", value: "1L"    }] },
      { sku: "COKE-2L",  price: 350, barcode: "5000112638029", optionValues: [{ optionName: "Size", value: "2L"    }] },
    ],
    branchStock: {
      Colombo: {
        "COKE-500": { stockQty: 120, stockUnit: "Each", basePriceOverride: 105, sellingPriceOverride: 110, discount: 5, taxRate: 8, lowStock: 20, available: true,  supplier: "Coca Cola Company" },
        "COKE-1L":  { stockQty: 60,  stockUnit: "Each", basePriceOverride: 185, sellingPriceOverride: 195, discount: 0, taxRate: 8, lowStock: 10, available: true,  supplier: "Coca Cola Company" },
        "COKE-2L":  { stockQty: 30,  stockUnit: "Each",                                                    discount: 0, taxRate: 8, lowStock: 5,  available: true,  supplier: "Coca Cola Company" },
      },
      Kandy: {
        "COKE-500": { stockQty: 0,   stockUnit: "Each",                                                    discount: 0, taxRate: 8, lowStock: 15, available: false, supplier: "Coca Cola Company" },
        "COKE-1L":  { stockQty: 45,  stockUnit: "Each", sellingPriceOverride: 190,                         discount: 2, taxRate: 8, lowStock: 8,  available: true,  supplier: "Coca Cola Company" },
        "COKE-2L":  { stockQty: 20,  stockUnit: "Each",                                                    discount: 0, taxRate: 8, lowStock: 5,  available: true,  supplier: "Coca Cola Company" },
      },
      Galle: {
        "COKE-500": { stockQty: 80,  stockUnit: "Each",                                                    discount: 3, taxRate: 8, lowStock: 10, available: true,  supplier: "Coca Cola Company" },
        "COKE-1L":  { stockQty: 40,  stockUnit: "Each",                                                    discount: 0, taxRate: 8, lowStock: 5,  available: true,  supplier: "Coca Cola Company" },
        "COKE-2L":  { stockQty: 15,  stockUnit: "Each", basePriceOverride: 360, sellingPriceOverride: 375, discount: 0, taxRate: 8, lowStock: 3,  available: true,  supplier: "Coca Cola Company" },
      },
    },
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
    options: [{ name: "Portion", values: ["Regular", "Large"] }],
    variants: [
      { sku: "CFR-REG", price: 550, barcode: "1234567890001", optionValues: [{ optionName: "Portion", value: "Regular" }] },
      { sku: "CFR-LRG", price: 750, barcode: "1234567890002", optionValues: [{ optionName: "Portion", value: "Large"   }] },
    ],
    branchStock: {
      Colombo: {
        "CFR-REG": { stockQty: 25, stockUnit: "Each", basePriceOverride: 560, sellingPriceOverride: 580, discount: 0, taxRate: 10, lowStock: 5, available: true, supplier: "Unilever Lanka" },
        "CFR-LRG": { stockQty: 15, stockUnit: "Each", basePriceOverride: 760, sellingPriceOverride: 790, discount: 0, taxRate: 10, lowStock: 3, available: true, supplier: "Unilever Lanka" },
      },
      Kandy: {
        "CFR-REG": { stockQty: 10, stockUnit: "Each",                                                     discount: 5, taxRate: 10, lowStock: 5, available: true, supplier: "MAS Holdings" },
        "CFR-LRG": { stockQty: 5,  stockUnit: "Each",                                                     discount: 5, taxRate: 10, lowStock: 2, available: true, supplier: "MAS Holdings" },
      },
      Galle: {
        "CFR-REG": { stockQty: 0,  stockUnit: "Each",                                                     discount: 0, taxRate: 10, lowStock: 5, available: false, supplier: "Ceylon Biscuits Ltd" },
        "CFR-LRG": { stockQty: 8,  stockUnit: "Each", sellingPriceOverride: 780,                          discount: 0, taxRate: 10, lowStock: 2, available: true,  supplier: "Ceylon Biscuits Ltd" },
      },
    },
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
    branchStock: {
      Colombo: {
        "WATER-1L": { stockQty: 200, stockUnit: "Each", basePriceOverride: 82, sellingPriceOverride: 85, discount: 0, taxRate: 5, lowStock: 30, available: true, supplier: "Elephant House" },
      },
      Kandy: {
        "WATER-1L": { stockQty: 150, stockUnit: "Each",                                                   discount: 0, taxRate: 5, lowStock: 20, available: true, supplier: "Elephant House" },
      },
      Galle: {
        "WATER-1L": { stockQty: 50,  stockUnit: "Each",                                                   discount: 2, taxRate: 5, lowStock: 15, available: true, supplier: "Elephant House" },
      },
    },
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
    branchStock: {
      Colombo: {
        "LASAGNA-STD": { stockQty: 12, stockUnit: "Each", basePriceOverride: 760, sellingPriceOverride: 790, discount: 0, taxRate: 12, lowStock: 3, available: true,  supplier: "Unilever Lanka" },
      },
      Kandy: {
        "LASAGNA-STD": { stockQty: 0,  stockUnit: "Each",                                                   discount: 0, taxRate: 12, lowStock: 2, available: false, supplier: "MAS Holdings" },
      },
      Galle: {
        "LASAGNA-STD": { stockQty: 8,  stockUnit: "Each",                                                   discount: 5, taxRate: 12, lowStock: 2, available: true,  supplier: "Ceylon Biscuits Ltd" },
      },
    },
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
    options: [{ name: "Add-ons", values: ["Extra Cheese", "Bacon"] }],
    variants: [
      { sku: "BURGER-BASE",   price: 650, barcode: "6001234500001", optionValues: [{ optionName: "Add-ons", value: "Extra Cheese" }] },
      { sku: "BURGER-CHEESE", price: 750, barcode: "6001234500002", optionValues: [{ optionName: "Add-ons", value: "Bacon"        }] },
    ],
    branchStock: {
      Colombo: {
        "BURGER-BASE":   { stockQty: 20, stockUnit: "Each", sellingPriceOverride: 670, discount: 0, taxRate: 10, lowStock: 5, available: true, supplier: "Unilever Lanka" },
        "BURGER-CHEESE": { stockQty: 15, stockUnit: "Each", sellingPriceOverride: 770, discount: 0, taxRate: 10, lowStock: 3, available: true, supplier: "Unilever Lanka" },
      },
      Kandy: {
        "BURGER-BASE":   { stockQty: 10, stockUnit: "Each",                            discount: 5, taxRate: 10, lowStock: 4, available: true, supplier: "MAS Holdings" },
        "BURGER-CHEESE": { stockQty: 8,  stockUnit: "Each",                            discount: 5, taxRate: 10, lowStock: 3, available: true, supplier: "MAS Holdings" },
      },
      Galle: {
        "BURGER-BASE":   { stockQty: 0,  stockUnit: "Each",                            discount: 0, taxRate: 10, lowStock: 4, available: false, supplier: "Ceylon Biscuits Ltd" },
        "BURGER-CHEESE": { stockQty: 5,  stockUnit: "Each",                            discount: 0, taxRate: 10, lowStock: 2, available: true,  supplier: "Ceylon Biscuits Ltd" },
      },
    },
  },
];