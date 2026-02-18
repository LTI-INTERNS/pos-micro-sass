export type SaleRow = {
  id: string;
  date: string;
  invoiceId: string;
  customer: string;
  items: number;
  paymentMethod: string;
  status: "Completed" | "Refunded" | "Pending";
  amount: number;
};

export type ExpenseRow = {
  id: string;
  date: string;
  category: string;
  description: string;
  approvedBy: string;
  amount: number;
};

export type ProductRow = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  revenue: number;
  stock: number;
};

import type { ExportColumn } from "@/app/components/Admin/reports/exportUtils";

export const SALE_COLUMNS: ExportColumn[] = [
  { key: "date",          label: "Date"           },
  { key: "invoiceId",     label: "Invoice ID"     },
  { key: "customer",      label: "Customer"       },
  { key: "items",         label: "Items"          },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "status",        label: "Status"         },
  { key: "amount",        label: "Amount ($)"     },
];

export const EXPENSE_COLUMNS: ExportColumn[] = [
  { key: "date",        label: "Date"        },
  { key: "category",    label: "Category"    },
  { key: "description", label: "Description" },
  { key: "approvedBy",  label: "Approved By" },
  { key: "amount",      label: "Amount ($)"  },
];

export const PRODUCT_COLUMNS: ExportColumn[] = [
  { key: "sku",       label: "SKU"          },
  { key: "name",      label: "Product Name" },
  { key: "category",  label: "Category"     },
  { key: "unitsSold", label: "Units Sold"   },
  { key: "revenue",   label: "Revenue ($)"  },
  { key: "stock",     label: "Stock Left"   },
];

const CUSTOMERS = [
  "Charlie Adams", "Jane Doe",     "Ali Hassan",   "Maria Kim",
  "Leo Reyes",     "Sofia Tan",    "James Vega",   "Priya Nair",
  "Tom Nguyen",    "Ella Martins",
];

const PAYMENTS = ["Credit Card", "Cash", "GCash", "PayMaya", "Debit Card"];
const STATUSES: SaleRow["status"][] = ["Completed", "Completed", "Completed", "Refunded", "Pending"];

export const SALES_DATA: SaleRow[] = Array.from({ length: 30 }, (_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id:            `sale-${i + 1}`,
    date:          `2026/01/${day}`,
    invoiceId:     `INV-${String(10000 + i + 1)}`,
    customer:      CUSTOMERS[i % CUSTOMERS.length],
    items:         (i % 6) + 1,
    paymentMethod: PAYMENTS[i % PAYMENTS.length],
    status:        STATUSES[i % STATUSES.length],
    amount:        parseFloat((45 + i * 13.75 + (i % 4) * 8).toFixed(2)),
  };
});


const EXP_CATEGORIES = ["Supplies", "Utilities", "Payroll", "Marketing", "Maintenance"];
const EXP_DESCRIPTIONS = [
  "Monthly electricity bill",
  "Office supplies restocking",
  "Staff weekly payroll",
  "Social media ad spend",
  "HVAC filter replacement",
  "Internet service provider",
  "Printer ink cartridges",
  "Part-time staff bonus",
  "Flyer printing",
  "Plumbing repair",
];
const MANAGERS = ["Ana Cruz", "Ben Santos", "Claire Lim", "Diego Ramos"];

export const EXPENSES_DATA: ExpenseRow[] = Array.from({ length: 15 }, (_, i) => {
  const day = String((i % 28) + 1).padStart(2, "0");
  return {
    id:          `exp-${i + 1}`,
    date:        `2026/01/${day}`,
    category:    EXP_CATEGORIES[i % EXP_CATEGORIES.length],
    description: EXP_DESCRIPTIONS[i % EXP_DESCRIPTIONS.length],
    approvedBy:  MANAGERS[i % MANAGERS.length],
    amount:      parseFloat((80 + i * 47.5).toFixed(2)),
  };
});

export const PRODUCTS_DATA: ProductRow[] = [
  { id: "p-01", sku: "BEV-001", name: "Coca-Cola 1L",          category: "Beverages", unitsSold: 312, revenue: 936.00,  stock: 88  },
  { id: "p-02", sku: "BEV-002", name: "Mineral Water 500ml",   category: "Beverages", unitsSold: 280, revenue: 420.00,  stock: 145 },
  { id: "p-03", sku: "SNK-001", name: "Lays Classic 100g",     category: "Snacks",    unitsSold: 210, revenue: 630.00,  stock: 60  },
  { id: "p-04", sku: "SNK-002", name: "Piattos Cheese 85g",    category: "Snacks",    unitsSold: 195, revenue: 585.00,  stock: 75  },
  { id: "p-05", sku: "FRZ-001", name: "Ice Cream Vanilla 1pt", category: "Frozen",    unitsSold: 140, revenue: 700.00,  stock: 32  },
  { id: "p-06", sku: "BEV-003", name: "Iced Tea Peach 500ml",  category: "Beverages", unitsSold: 265, revenue: 795.00,  stock: 110 },
  { id: "p-07", sku: "DRY-001", name: "White Rice 5kg",        category: "Dry Goods", unitsSold: 98,  revenue: 1960.00, stock: 42  },
  { id: "p-08", sku: "DRY-002", name: "Cooking Oil 1L",        category: "Dry Goods", unitsSold: 125, revenue: 1375.00, stock: 55  },
  { id: "p-09", sku: "CNF-001", name: "Chocolate Bar 50g",     category: "Confection",unitsSold: 350, revenue: 525.00,  stock: 200 },
  { id: "p-10", sku: "CNF-002", name: "Gummy Bears 100g",      category: "Confection",unitsSold: 175, revenue: 437.50,  stock: 95  },
  { id: "p-11", sku: "DRY-003", name: "Instant Noodles 65g",   category: "Dry Goods", unitsSold: 400, revenue: 600.00,  stock: 180 },
  { id: "p-12", sku: "BEV-004", name: "Energy Drink 250ml",    category: "Beverages", unitsSold: 220, revenue: 1100.00, stock: 65  },
];

export const REPORT_STATS = [
  { title: "Total Sales",        value: "$9,842.50", percentage: "↑ 4.2%", trend: "up"   as const, caption: "from last month" },
  { title: "Total Expenses",     value: "$3,120.00", percentage: "↓ 1.5%", trend: "down" as const, caption: "from last month" },
  { title: "Net Profit",         value: "$6,722.50", percentage: "↑ 6.8%", trend: "up"   as const, caption: "from last month" },
  { title: "Transactions Count", value: "823",       percentage: "↑ 4.0%", trend: "up"   as const, caption: "from last month" },
];

export const SALES_TREND_DATA = [
  { day: "Jan 20", sales: 320, expenses: 130 },
  { day: "Jan 21", sales: 450, expenses: 160 },
  { day: "Jan 22", sales: 380, expenses: 150 },
  { day: "Jan 23", sales: 510, expenses: 200 },
  { day: "Jan 24", sales: 470, expenses: 175 },
  { day: "Jan 25", sales: 600, expenses: 220 },
  { day: "Jan 26", sales: 720, expenses: 250 },
  { day: "Jan 27", sales: 810, expenses: 290 },
  { day: "Jan 28", sales: 580, expenses: 210 },
];

export const DAILY_BREAKDOWN_DATA = [
  { day: "Jan 20", revenue: 320, profit: 190 },
  { day: "Jan 21", revenue: 450, profit: 290 },
  { day: "Jan 22", revenue: 380, profit: 230 },
  { day: "Jan 23", revenue: 510, profit: 310 },
  { day: "Jan 24", revenue: 470, profit: 295 },
  { day: "Jan 25", revenue: 600, profit: 380 },
  { day: "Jan 26", revenue: 720, profit: 470 },
  { day: "Jan 27", revenue: 810, profit: 520 },
  { day: "Jan 28", revenue: 580, profit: 370 },
];

export const CATEGORY_BREAKDOWN_DATA = [
  { day: "Jan 20", beverages: 140, snacks: 90,  dryGoods: 60, confection: 30 },
  { day: "Jan 21", beverages: 180, snacks: 120, dryGoods: 90, confection: 60 },
  { day: "Jan 22", beverages: 160, snacks: 100, dryGoods: 75, confection: 45 },
  { day: "Jan 23", beverages: 200, snacks: 140, dryGoods: 95, confection: 75 },
  { day: "Jan 24", beverages: 190, snacks: 130, dryGoods: 88, confection: 62 },
  { day: "Jan 25", beverages: 240, snacks: 160, dryGoods: 110, confection: 90 },
  { day: "Jan 26", beverages: 280, snacks: 190, dryGoods: 130, confection: 120 },
  { day: "Jan 27", beverages: 310, snacks: 210, dryGoods: 155, confection: 135 },
  { day: "Jan 28", beverages: 220, snacks: 165, dryGoods: 110, confection: 85 },
];


export type ForecastRow = {
  label: string;
  actual: number;
  predicted: number;
};

/* Product Demand Forecast (Line Chart) */
export const PRODUCT_FORECAST_DATA: ForecastRow[] = [
  { label: "Jan", actual: 100, predicted: 110 },
  { label: "Feb", actual: 200, predicted: 190 },
  { label: "Mar", actual: 280, predicted: 220 },
  { label: "Apr", actual: 230, predicted: 250 },
  { label: "May", actual: 260, predicted: 260 },
  { label: "Jun", actual: 290, predicted: 270 },
  { label: "Jul", actual: 300, predicted: 280 },
  { label: "Aug", actual: 310, predicted: 295 },
  { label: "Sep", actual: 320, predicted: 310 },
];

/* Sales Forecast (Bar Chart) */
export const SALES_FORECAST_DATA: ForecastRow[] = [
  { label: "Jan", actual: 3800, predicted: 3000 },
  { label: "Feb", actual: 2200, predicted: 2100 },
  { label: "Mar", actual: 2500, predicted: 2900 },
  { label: "Apr", actual: 3200, predicted: 2700 },
  { label: "May", actual: 3400, predicted: 3600 },
  { label: "Jun", actual: 0,    predicted: 3700 },
  { label: "Jul", actual: 0,    predicted: 3900 },
];

/* Branch Performance Comparison */
export const BRANCH_FORECAST_DATA: ForecastRow[] = [
  { label: "Branch 1", actual: 3800, predicted: 3000 },
  { label: "Branch 2", actual: 2100, predicted: 2000 },
  { label: "Branch 3", actual: 2300, predicted: 2600 },
  { label: "Branch 4", actual: 2900, predicted: 2100 },
  { label: "Branch 5", actual: 3200, predicted: 3500 },
];
