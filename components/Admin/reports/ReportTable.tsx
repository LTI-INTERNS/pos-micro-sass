"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { expenseApi, ExpenseApiItem } from "@/lib/api/expenses";
import { productService, Product } from "@/lib/services";
import { orderService } from "@/lib/services/order-service";
import type { Order } from "@/types/order.types";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import type { SaleRow, ExpenseRow, ProductRow } from "@/app/reports/reportsMockData";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Props = {
  activeTab: string;
  search: string;
  salesData: SaleRow[];
  expensesData: ExpenseRow[];
  selectedSale: SaleRow | null;
  selectedExpense: ExpenseRow | null;
  selectedProduct: ProductRow | null;
  onSelectSale: (row: SaleRow | null) => void;
  onSelectExpense: (row: ExpenseRow | null) => void;
  onSelectProduct: (row: ProductRow | null) => void;
};

function filterRows<T>(data: T[], search: string, keys: (keyof T)[]): T[] {
  if (!search.trim()) return data;
  const q = search.toLowerCase();
  return data.filter((row) =>
    keys.some((k) => String(row[k]).toLowerCase().includes(q))
  );
}

const mapExpense = (item: ExpenseApiItem): ExpenseRow => ({
  id: item.expensesId,
  date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
  category: item.category?.category ?? "",
  description: item.description ?? "",
  approvedBy: item.addedByName ?? "",
  amount: Number(item.amount ?? 0),
  branch: item.branch?.name ?? "",
});



const mapOrderToSaleRow = (order: Order): SaleRow => ({
  id: order.id,
  date: order.dateTime
    ? new Date(order.dateTime).toISOString().split("T")[0]
    : "",
  invoiceId: order.orderNumber ?? "—",
  customer: order.customer ?? "Walk-in Customer",
  items: order.items?.length ?? 0,
  paymentMethod: order.paymenttype ?? "—",
  status:
    order.status === "COMPLETED"
      ? "Completed"
      : order.status === "CANCELED"
      ? "Refunded"
      : "Pending",
  amount: Number(order.totalamount ?? 0),
  branch: order.branch ?? "—",
});



type ProductReportRow = {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;
  variants: number;
  basePrice: number;
  sellingPrice: number;
  stockQty: number;
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  createdAt: string;
};

function mapProductToReportRow(product: Product): ProductReportRow {
  const variants = product.variants ?? [];

  const basePrices = variants.map((v) =>
    Number((v as any).basePrice ?? v.price ?? 0)
  );
  const sellingPrices = variants.map((v) =>
    Number((v as any).sellingPrice ?? v.price ?? 0)
  );
  const totalStock = variants.reduce(
    (sum, v) => sum + Number((v as any).stockQty ?? 0),
    0
  );

  const allSkus = variants.map((v) => v.sku).filter(Boolean).join(", ");

  let stockStatus: ProductReportRow["stockStatus"] = "In Stock";
  for (const v of variants) {
    const qty = Number((v as any).stockQty ?? 0);
    const low = Number((v as any).lowStock ?? 0);
    if (qty <= 0) {
      stockStatus = "Out of Stock";
      break;
    }
    if (qty <= low) stockStatus = "Low Stock";
  }

  return {
    id: String(product.id),
    name: product.name ?? "",
    category: product.category ?? "—",
    brand: product.brand ?? "—",
    sku: allSkus || "—",
    variants: variants.length,
    basePrice: basePrices.length ? Math.min(...basePrices) : 0,
    sellingPrice: sellingPrices.length ? Math.min(...sellingPrices) : 0,
    stockQty: totalStock,
    stockStatus,
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString().split("T")[0]
      : "—",
  };
}



export default function ReportTable({
  activeTab,
  search,
  salesData,
  expensesData,
  selectedSale,
  onSelectSale,
  selectedExpense,
  onSelectExpense,
  selectedProduct,
  onSelectProduct,
}: Props) {
  const { currency, useCents } = useCurrency();
  const { data: session, status } = useSession();

  
  const [realSales, setRealSales] = useState<SaleRow[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "sales" || status !== "authenticated") return;

    setSalesLoading(true);

    orderService
      .getAll({ page: 1, limit: 1000 }) // 🔥 FIX: fetch full dataset
      .then((data) => setRealSales(data.map(mapOrderToSaleRow)))
      .catch(() => setRealSales([]))
      .finally(() => setSalesLoading(false));
  }, [activeTab, status]);

  const finalSalesData = realSales.length > 0 ? realSales : salesData;

  
  const [realExpenses, setRealExpenses] = useState<ExpenseRow[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    expenseApi
      .getExpenses(session)
      .then((rows) => setRealExpenses(rows.map(mapExpense)))
      .catch(() => setRealExpenses([]));
  }, [status, session]);

  const finalExpensesData =
    realExpenses.length > 0 ? realExpenses : expensesData;

 
  const [productReportRows, setProductReportRows] = useState<ProductReportRow[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "products" || status !== "authenticated") return;

    setProductsLoading(true);

    productService
      .getAll()
      .then((data) => setProductReportRows(data.map(mapProductToReportRow)))
      .catch(() => setProductReportRows([]))
      .finally(() => setProductsLoading(false));
  }, [activeTab, status]);

  

  const SALE_COLS: Column<SaleRow>[] = [
    { key: "index", label: "", render: (_, i) => i + 1 },
    { key: "date", label: "Date" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items", align: "center" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
            row.status === "Completed"
              ? "text-green-600 bg-green-50"
              : row.status === "Refunded"
              ? "text-red-500 bg-red-50"
              : "text-yellow-600 bg-yellow-50"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (row) =>
        formatCurrency(row.amount, currency, useCents),
    },
    { key: "branch", label: "Branch" },
  ];

 

  const EXPENSE_COLS: Column<ExpenseRow>[] = [
    { key: "index", label: "", render: (_, i) => i + 1 },
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "approvedBy", label: "Approved By" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (row) =>
        formatCurrency(row.amount, currency, useCents),
    },
    { key: "branch", label: "Branch" },
  ];



const PRODUCT_COLS: Column<ProductReportRow>[] = [
  { key: "index", label: "", render: (_, i) => i + 1 },
  { key: "name", label: "Product Name" },
  { key: "category", label: "Category" },
  { key: "variants", label: "Variants", align: "center" },
  { key: "basePrice", label: "Base Price", align: "right" },
  { key: "sellingPrice", label: "Selling Price", align: "right" },
  { key: "stockQty", label: "Total Stock", align: "center" },

  
  {
    key: "stockStatus",
    label: "Stock Status",
    render: (row) => {
      const styles = {
        "In Stock": "bg-green-100 text-green-700",
        "Low Stock": "bg-yellow-100 text-yellow-700",
        "Out of Stock": "bg-red-100 text-red-700",
      };

      return (
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${styles[row.stockStatus]}`}
        >
          {row.stockStatus}
        </span>
      );
    },
  },

  { key: "createdAt", label: "Added On" },
];

  
  if (activeTab === "sales") {
    if (salesLoading) {
      return (
        <div className="mb-4 p-8 text-center text-slate-500 text-sm">
          Loading sales…
        </div>
      );
    }

    const filtered = filterRows(
      finalSalesData,
      search,
      ["date", "invoiceId", "customer", "paymentMethod", "status"]
    );

    return (
      <div className="mb-4 max-h-120 overflow-y-auto">
        <CommonTable
          title="Sales Transactions"
          data={filtered}
          columns={SALE_COLS}
          emptyMessage="No sales found"
          selectedRowId={selectedSale?.id}
          onSelectRow={onSelectSale}
        />
      </div>
    );
  }

  if (activeTab === "expenses") {
    const filtered = filterRows(
      finalExpensesData,
      search,
      ["date", "category", "description", "approvedBy"]
    );

    return (
      <div className="mb-4 max-h-120 overflow-y-auto">
        <CommonTable
          title="Expense Records"
          data={filtered}
          columns={EXPENSE_COLS}
          emptyMessage="No expenses found"
          selectedRowId={selectedExpense?.id}
          onSelectRow={onSelectExpense}
        />
      </div>
    );
  }

  if (activeTab === "products") {
    if (productsLoading) {
      return (
        <div className="mb-4 p-8 text-center text-slate-500 text-sm">
          Loading products…
        </div>
      );
    }

    const filtered = filterRows(
      productReportRows,
      search,
      ["name", "category", "brand", "sku"]
    );

    return (
      <div className="mb-4 max-h-120 overflow-y-auto">
        <CommonTable
          title="Product Inventory Report"
          data={filtered}
          columns={PRODUCT_COLS}
          emptyMessage="No products found"
          selectedRowId={selectedProduct?.id}
          onSelectRow={(row) =>
            row &&
            onSelectProduct({
              id: row.id,
              sku: row.sku,
              name: row.name,
              category: row.category,
              unitsSold: 0,
              revenue: 0,
              stock: row.stockQty,
            })
          }
        />
      </div>
    );
  }

  return null;
}