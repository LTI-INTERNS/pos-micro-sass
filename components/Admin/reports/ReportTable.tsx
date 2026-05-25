﻿﻿﻿"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { expenseApi, ExpenseApiItem } from "@/lib/api/expenses";
import { productService, Product } from "@/lib/services";
import { orderService } from "@/lib/services/order-service";
import type { Order } from "@/types/order.types";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import ModalShell from "@/components/Admin/common/ModalShell";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import type { DateRangeParams } from "@/types/analytics.types";
import type { SaleRow, ExpenseRow, ProductRow } from "@/types/report.type";

type Props = {
  activeTab: string;
  search: string;
  dateRange?: DateRangeParams;
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

function isWithinDateRange(date: string | undefined, dateRange?: DateRangeParams) {
  if (!dateRange?.startDate || !dateRange?.endDate) return true;
  if (!date) return true;
  return date >= dateRange.startDate && date <= dateRange.endDate;
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

function formatOrderItems(items: Order["items"]): string {
  if (!items || items.length === 0) return "-";
  return items.map((i) => `${i.qty}x ${i.name}`).join("\n");
}



const mapOrderToSaleRow = (order: Order): SaleRow => ({
  id: order.id,
  date: order.dateTime
    ? new Date(order.dateTime).toISOString().split("T")[0]
    : "",
  invoiceId: order.orderNumber ?? "Unknown",
  customer: order.customer ?? "Unknown Customer",
  // Important: avoid extra per-order fetches on initial load.
  // If list endpoint doesn't include items, load them lazily on "View".
  items: order.items && order.items.length > 0 ? formatOrderItems(order.items) : "",
  paymentMethod: order.paymenttype ?? "Unknown",
  status:
    order.status === "COMPLETED"
      ? "Completed"
      : order.status === "CANCELED"
      ? "Refunded"
      : "Pending",
  amount: Number(order.totalamount ?? 0),
  branch: order.branch ?? "Unknown",
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
    Number(v.basePrice ?? v.price ?? 0)
  );
  const sellingPrices = variants.map((v) =>
    Number(v.sellingPrice ?? v.price ?? 0)
  );
  const totalStock = variants.reduce(
    (sum, v) => sum + Number(v.stockQty ?? 0),
    0
  );

  const allSkus = variants.map((v) => v.sku).filter(Boolean).join(", ");

  let stockStatus: ProductReportRow["stockStatus"] = "In Stock";
  for (const v of variants) {
    const qty = Number(v.stockQty ?? 0);
    const low = Number(v.lowStock ?? 0);
    if (qty <= 0) {
      stockStatus = "Out of Stock";
      break;
    }
    if (qty <= low) stockStatus = "Low Stock";
  }

  return {
    id: String(product.id),
    name: product.name ?? "",
    category: product.category ?? "Unknown",
    brand: product.brand ?? "Unknown",
    sku: allSkus || "Unknown",
    variants: variants.length,
    basePrice: basePrices.length ? Math.min(...basePrices) : 0,
    sellingPrice: sellingPrices.length ? Math.min(...sellingPrices) : 0,
    stockQty: totalStock,
    stockStatus,
    createdAt: product.createdAt
      ? new Date(product.createdAt).toISOString().split("T")[0]
      : "Unknown",
  };
}



export default function ReportTable({
  activeTab,
  search,
  dateRange,
  selectedSale,
  onSelectSale,
  selectedExpense,
  onSelectExpense,
  selectedProduct,
  onSelectProduct,
}: Props) {
  const { currency, useCents } = useCurrency();
  const { data: session, status } = useSession();

  const [itemsPopupOpen, setItemsPopupOpen] = useState(false);
  const [itemsPopupSale, setItemsPopupSale] = useState<SaleRow | null>(null);
  const [itemsPopupLoading, setItemsPopupLoading] = useState(false);
  const [itemsPopupItemsText, setItemsPopupItemsText] = useState<string>("");
  const [orderItemsCache, setOrderItemsCache] = useState<Record<string, string>>(
    {}
  );
  const activeItemsRequestRef = useRef<string | null>(null);

  
  const [realSales, setRealSales] = useState<SaleRow[]>([]);
  const [salesLoading, setSalesLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "sales" || status !== "authenticated") return;

    setSalesLoading(true);
    let cancelled = false;

    orderService
      .getAll({ page: 1, limit: 1000 }) // ðŸ”¥ FIX: fetch full dataset
      .then((data) => {
        if (cancelled) return;
        setRealSales(data.map(mapOrderToSaleRow));
      })
      .catch(() => {
        if (cancelled) return;
        setRealSales([]);
      })
      .finally(() => {
        if (cancelled) return;
        setSalesLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [activeTab, status]);

  const finalSalesData = realSales;

  const filteredSalesData = useMemo(
    () => finalSalesData.filter((row) => isWithinDateRange(row.date, dateRange)),
    [finalSalesData, dateRange]
  );

  
  const [realExpenses, setRealExpenses] = useState<ExpenseRow[]>([]);

  useEffect(() => {
    if (status !== "authenticated") return;

    expenseApi
      .getExpenses(session)
      .then((rows) => setRealExpenses(rows.map(mapExpense)))
      .catch(() => setRealExpenses([]));
  }, [status, session]);

  const finalExpensesData = realExpenses;

  const filteredExpensesData = useMemo(
    () =>
      finalExpensesData.filter((row) =>
        isWithinDateRange(row.date, dateRange)
      ),
    [finalExpensesData, dateRange]
  );

 
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

  const filteredProductRows = useMemo(
    () =>
      productReportRows.filter((row) =>
        isWithinDateRange(row.createdAt, dateRange)
      ),
    [productReportRows, dateRange]
  );

  

  const SALE_COLS: Column<SaleRow>[] = [
    { key: "index", label: "", render: (_, i) => i + 1 },
    { key: "date", label: "Date" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    {
      key: "items",
      label: "Items",
      render: (row) => {
        return (
          <button
            type="button"
            className="text-xs font-semibold underline underline-offset-2 text-indigo-600 hover:text-indigo-700 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setItemsPopupSale(row);
              setItemsPopupOpen(true);

              const cached = orderItemsCache[row.id];
              if (typeof cached === "string") {
                setItemsPopupItemsText(cached);
                setItemsPopupLoading(false);
                return;
              }

              setItemsPopupItemsText("");
              setItemsPopupLoading(true);

              const requestKey = `${row.id}:${Date.now()}`;
              activeItemsRequestRef.current = requestKey;

              orderService
                .getById(row.id)
                .then((fullOrder) => {
                  if (activeItemsRequestRef.current !== requestKey) return;
                  const formatted = formatOrderItems(fullOrder.items);
                  setOrderItemsCache((prev) => ({ ...prev, [row.id]: formatted }));
                  setItemsPopupItemsText(formatted);
                })
                .catch(() => {
                  if (activeItemsRequestRef.current !== requestKey) return;
                  setItemsPopupItemsText("-");
                })
                .finally(() => {
                  if (activeItemsRequestRef.current !== requestKey) return;
                  setItemsPopupLoading(false);
                });
            }}
          >
            View
          </button>
        );
      },
    },
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
          Loading sales....
        </div>
      );
    }

    const filtered = filterRows(
      filteredSalesData,
      search,
      ["date", "invoiceId", "customer", "items", "paymentMethod", "status"]
    );

    return (
      <>
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

        <ModalShell
          open={itemsPopupOpen}
          title={`Items • Invoice ${itemsPopupSale?.invoiceId ?? ""}`}
          onClose={() => {
            setItemsPopupOpen(false);
            setItemsPopupSale(null);
            setItemsPopupLoading(false);
            setItemsPopupItemsText("");
            activeItemsRequestRef.current = null;
          }}
          widthClassName="w-[720px] max-w-[92vw]"
        >
          <div className="space-y-4">
            <div className="text-sm text-slate-600">
              <span className="font-semibold text-slate-800">Customer:</span>{" "}
              {itemsPopupSale?.customer ?? "-"}
            </div>

            <div className="max-h-[60vh] overflow-auto rounded-xl border bg-slate-50 p-3">
              {itemsPopupLoading ? (
                <div className="text-sm text-slate-500">Loading items...</div>
              ) : itemsPopupItemsText ? (
                <ul className="space-y-2">
                  {itemsPopupItemsText
                    .split("\n")
                    .map((line) => line.trim())
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li
                        key={`${idx}-${line}`}
                        className="rounded-lg bg-white px-3 py-2 text-sm text-slate-800 shadow-sm"
                      >
                        {line}
                      </li>
                    ))}
                </ul>
              ) : (
                <div className="text-sm text-slate-500">No items.</div>
              )}
            </div>
          </div>
        </ModalShell>
      </>
    );
  }

  if (activeTab === "expenses") {
    const filtered = filterRows(
      filteredExpensesData,
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
          Loading products....
        </div>
      );
    }

    const filtered = filterRows(
      filteredProductRows,
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