"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { expenseApi, ExpenseApiItem } from "@/lib/api/expenses";
import { productService, Product } from "@/lib/services";

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

// ── map API expense → ExpenseRow ──────────────────────────────────────────────
const mapExpense = (item: ExpenseApiItem): ExpenseRow => ({
  id: item.expensesId,
  date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
  category: item.category?.category ?? "",
  description: item.description ?? "",
  approvedBy: item.addedByName ?? "",
  amount: Number(item.amount ?? 0),
  branch: item.branch?.name ?? "",
});

// ── Derived product report row ────────────────────────────────────────────────
type ProductReportRow = {
  id: string;
  name: string;
  category: string;
  brand: string;
  sku: string;           // comma-joined when multiple variants
  variants: number;
  basePrice: number;     // min base price across variants
  sellingPrice: number;  // min selling price across variants
  stockQty: number;      // total stock across all variants
  stockStatus: "In Stock" | "Low Stock" | "Out of Stock";
  createdAt: string;
};

function mapProductToReportRow(product: Product): ProductReportRow {
  const variants = product.variants ?? [];

  const basePrices = variants.map((v) => Number((v as { basePrice?: number; price?: number }).basePrice ?? v.price ?? 0));
  const sellingPrices = variants.map((v) => Number((v as { sellingPrice?: number; price?: number }).sellingPrice ?? v.price ?? 0));
  const totalStock = variants.reduce((sum, v) => sum + Number((v as { stockQty?: number }).stockQty ?? 0), 0);

  const allSkus = variants.map((v) => v.sku).filter(Boolean).join(", ");

  // Determine worst-case stock status across variants
  let stockStatus: ProductReportRow["stockStatus"] = "In Stock";
  for (const v of variants) {
    const qty = Number((v as { stockQty?: number }).stockQty ?? 0);
    const low = Number((v as { lowStock?: number }).lowStock ?? 0);
    if (qty <= 0) { stockStatus = "Out of Stock"; break; }
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

  // ── Real expense state ─────────────────────────────────────────────────────
  const [realExpenses, setRealExpenses] = useState<ExpenseRow[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;
    expenseApi
      .getExpenses(session)
      .then((rows) => setRealExpenses(rows.map(mapExpense)))
      .catch(() => setRealExpenses([]));
  }, [status, session]);

  // ── Real product state ─────────────────────────────────────────────────────
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

  const finalExpensesData = realExpenses.length > 0 ? realExpenses : expensesData;

  // ── Sales columns ──────────────────────────────────────────────────────────
  const SALE_COLS: Column<SaleRow>[] = [
    { key: "index", label: "", render: (_, index) => index + 1 },
    { key: "date", label: "Date" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items", align: "center" },
    { key: "paymentMethod", label: "Payment Method" },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const styles: Record<SaleRow["status"], string> = {
          Completed: "text-green-600 bg-green-50",
          Refunded: "text-red-500 bg-red-50",
          Pending: "text-yellow-600 bg-yellow-50",
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (row) => formatCurrency(row.amount, currency, useCents),
    },
    { key: "branch", label: "Branch" },
  ];

  // ── Expense columns ────────────────────────────────────────────────────────
  const EXPENSE_COLS: Column<ExpenseRow>[] = [
    { key: "index", label: "", render: (_, index) => index + 1 },
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "approvedBy", label: "Approved By" },
    {
      key: "amount",
      label: "Amount",
      align: "right",
      render: (row) => formatCurrency(row.amount, currency, useCents),
    },
    { key: "branch", label: "Branch" },
  ];

  // ── Product report columns (real-world report view) ────────────────────────
  const PRODUCT_COLS: Column<ProductReportRow>[] = [
    { key: "index", label: "", render: (_, index) => index + 1 },
    {
      key: "name",
      label: "Product Name",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-gray-800">{row.name}</p>
          {row.brand !== "—" && (
            <p className="text-[11px] text-gray-400 mt-0.5">{row.brand}</p>
          )}
        </div>
      ),
    },
    { key: "category", label: "Category" },
    {
      key: "variants",
      label: "Variants",
      align: "center",
      render: (row) => (
        <span className="text-gray-600">{row.variants}</span>
      ),
    },
    {
      key: "basePrice",
      label: "Base Price",
      align: "right",
      render: (row) => (
        <span className="text-gray-700">
          {formatCurrency(row.basePrice, currency, useCents)}
          {row.variants > 1 && (
            <span className="text-gray-400 text-[10px] ml-0.5">+</span>
          )}
        </span>
      ),
    },
    {
      key: "sellingPrice",
      label: "Selling Price",
      align: "right",
      render: (row) => (
        <span className="font-medium text-gray-800">
          {formatCurrency(row.sellingPrice, currency, useCents)}
          {row.variants > 1 && (
            <span className="text-gray-400 text-[10px] ml-0.5">+</span>
          )}
        </span>
      ),
    },
    {
      key: "stockQty",
      label: "Total Stock",
      align: "center",
      render: (row) => (
        <span
          className={
            row.stockQty === 0
              ? "text-red-500 font-semibold"
              : row.stockStatus === "Low Stock"
                ? "text-orange-500 font-medium"
                : "text-gray-700"
          }
        >
          {row.stockQty}
        </span>
      ),
    },
    {
      key: "stockStatus",
      label: "Stock Status",
      render: (row) => {
        const styles: Record<ProductReportRow["stockStatus"], string> = {
          "In Stock": "text-green-600 bg-green-50",
          "Low Stock": "text-orange-500 bg-orange-50",
          "Out of Stock": "text-red-500 bg-red-50",
        };
        return (
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${styles[row.stockStatus]}`}>
            {row.stockStatus}
          </span>
        );
      },
    },
    { key: "createdAt", label: "Added On" },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────

  if (activeTab === "expenses") {
    const filtered = filterRows<ExpenseRow>(
      finalExpensesData,
      search,
      ["date", "category", "description", "approvedBy"]
    );
    return (
      <div className="mb-4 max-h-120 overflow-y-auto">
        <CommonTable<ExpenseRow>
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

    const filtered = filterRows<ProductReportRow>(
      productReportRows,
      search,
      ["name", "category", "brand", "sku"]
    );

    // Wrap in a ProductRow-compatible shape for onSelectProduct
    // We keep the existing ProductRow contract intact for the parent
    const wrappedOnSelect = (row: ProductReportRow | null) => {
      if (!row) { onSelectProduct(null); return; }
      // Map back to ProductRow shape expected by the parent
      onSelectProduct({
        id: row.id,
        sku: row.sku,
        name: row.name,
        category: row.category,
        unitsSold: 0,      // not available from product catalog
        revenue: 0,        // not available from product catalog
        stock: row.stockQty,
      } as ProductRow);
    };

    return (
      <div className="mb-4 max-h-120 overflow-y-auto">
        <CommonTable<ProductReportRow>
          title="Product Inventory Report"
          data={filtered}
          columns={PRODUCT_COLS}
          emptyMessage="No products found"
          selectedRowId={selectedProduct?.id}
          onSelectRow={wrappedOnSelect}
        />
      </div>
    );
  }

  // ── Sales (default) ────────────────────────────────────────────────────────
  const filtered = filterRows<SaleRow>(
    salesData,
    search,
    ["date", "invoiceId", "customer", "paymentMethod", "status"]
  );

  return (
    <div className="mb-4 max-h-120 overflow-y-auto">
      <CommonTable<SaleRow>
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