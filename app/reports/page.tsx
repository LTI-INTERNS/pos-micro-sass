"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import DateRangeBar from "@/components/Admin/common/DateRangeBar";
import ExportReportPanel from "@/components/Admin/reports/ExportReportPanel";
import ReportStatCardGrid from "@/components/Admin/reports/ReportStatCardGrid";
import ReportChart from "@/components/Admin/reports/ReportChart";
import ReportActionsBar from "@/components/Admin/reports/ReportActionsBar";
import ReportTable from "@/components/Admin/reports/ReportTable";
import type { SaleRow, ExpenseRow, ProductRow } from "@/types/report.type";
import type { ExportColumn } from "@/components/Admin/reports/exportUtils";
import { expenseApi, type ExpenseApiItem } from "@/lib/api/expenses";
import { orderService } from "@/lib/services/order-service";
import { productService, type Product } from "@/lib/services";
import type { Order } from "@/types/order.types";

type TableTab = "sales" | "expenses" | "products";

type ExportConfig = {
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  filename: string;
  title: string;
  subtitle: string;
};

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

export default function ReportsPage() {
  const { data: session, status } = useSession();

  const [search, setSearch] = useState("");
  const [chartTab, setChartTab] = useState("revenue-orders");
  const [tableTab, setTableTab] = useState<TableTab>("sales");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  const statDateRange = useMemo(() => {
    if (!startDate || !endDate) return undefined;
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }, [startDate, endDate]);

  const [selectedSale, setSelectedSale] = useState<SaleRow | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRow | null>(
    null
  );
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null
  );

  // Real export datasets (avoid reportsMockData.ts)
  const [salesData, setSalesData] = useState<SaleRow[]>([]);
  const [expensesData, setExpensesData] = useState<ExpenseRow[]>([]);
  const [productsData, setProductsData] = useState<ProductReportRow[]>([]);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    setExportLoading(true);

    const salesPromise = orderService
      .getAll({ page: 1, limit: 1000 })
      .then(async (orders) => enrichOrdersWithItems(orders))
      .then((orders) => orders.map(mapOrderToSaleRow))
      .catch(() => [] as SaleRow[]);

    const expensesPromise = expenseApi
      .getExpenses(session)
      .then((rows) => rows.map(mapExpense))
      .catch(() => [] as ExpenseRow[]);

    const productsPromise = productService
      .getAll()
      .then((rows) => rows.map(mapProductToReportRow))
      .catch(() => [] as ProductReportRow[]);

    Promise.all([salesPromise, expensesPromise, productsPromise])
      .then(([sales, expenses, products]) => {
        if (cancelled) return;
        setSalesData(sales);
        setExpensesData(expenses);
        setProductsData(products);
      })
      .finally(() => {
        if (cancelled) return;
        setExportLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, session]);

  const branchLabel = "All Branches";

  const SALE_COLUMNS: ExportColumn[] = [
    { key: "date", label: "Date" },
    { key: "invoiceId", label: "Invoice ID" },
    { key: "customer", label: "Customer" },
    { key: "items", label: "Items" },
    { key: "paymentMethod", label: "Payment Method" },
    { key: "status", label: "Status" },
    { key: "amount", label: "Amount" },
    { key: "branch", label: "Branch" },
  ];

  const EXPENSE_COLUMNS: ExportColumn[] = [
    { key: "date", label: "Date" },
    { key: "category", label: "Category" },
    { key: "description", label: "Description" },
    { key: "approvedBy", label: "Approved By" },
    { key: "amount", label: "Amount" },
    { key: "branch", label: "Branch" },
  ];

  const PRODUCT_COLUMNS: ExportColumn[] = [
    { key: "name", label: "Product Name" },
    { key: "category", label: "Category" },
    { key: "sku", label: "SKU" },
    { key: "variants", label: "Variants" },
    { key: "basePrice", label: "Base Price" },
    { key: "sellingPrice", label: "Selling Price" },
    { key: "stockQty", label: "Total Stock" },
    { key: "stockStatus", label: "Stock Status" },
    { key: "createdAt", label: "Added On" },
  ];

  const EXPORT_CONFIGS: Record<TableTab, ExportConfig> = {
    sales: {
      data: salesData as Record<string, unknown>[],
      columns: SALE_COLUMNS,
      filename: "sales-report",
      title: "Sales Report",
      subtitle: `${branchLabel} - Sales`,
    },
    expenses: {
      data: expensesData as Record<string, unknown>[],
      columns: EXPENSE_COLUMNS,
      filename: "expenses-report",
      title: "Expenses Report",
      subtitle: `${branchLabel} - Expenses`,
    },
    products: {
      data: productsData as Record<string, unknown>[],
      columns: PRODUCT_COLUMNS,
      filename: "products-report",
      title: "Products Report",
      subtitle: "Product inventory snapshot",
    },
  };

  const exportConfig = EXPORT_CONFIGS[tableTab];

  const hasSelection =
    (tableTab === "sales" && selectedSale !== null) ||
    (tableTab === "expenses" && selectedExpense !== null) ||
    (tableTab === "products" && selectedProduct !== null);

  const handleTabChange = (tab: string) => {
    setTableTab(tab as TableTab);
    setSelectedSale(null);
    setSelectedExpense(null);
    setSelectedProduct(null);
    setSearch("");
  };

  const handleViewDetails = () => {
    if (tableTab === "sales" && selectedSale)
      alert(
        `Invoice: ${selectedSale.invoiceId}\nCustomer: ${selectedSale.customer}\nAmount: $${selectedSale.amount}\nBranch: ${selectedSale.branch}`
      );
    if (tableTab === "expenses" && selectedExpense)
      alert(
        `Category: ${selectedExpense.category}\nDesc: ${selectedExpense.description}\nAmount: $${selectedExpense.amount}\nBranch: ${selectedExpense.branch}`
      );
    if (tableTab === "products" && selectedProduct)
      alert(
        `SKU: ${selectedProduct.sku}\nProduct: ${selectedProduct.name}\nRevenue: $${selectedProduct.revenue}`
      );
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <ReportStatCardGrid
          sales={salesData.map((r) => ({ date: r.date, amount: r.amount }))}
          expenses={expensesData.map((r) => ({ date: r.date, amount: r.amount }))}
          transactionCount={salesData.length}
          dateRange={statDateRange}
        />

        <DateRangeBar
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          <ReportChart
            activeTab={chartTab}
            onTabChange={setChartTab}
            dateRange={
              startDate && endDate
                ? {
                    startDate: startDate.toISOString().split("T")[0],
                    endDate: endDate.toISOString().split("T")[0],
                  }
                : undefined
            }
          />

          <div className="w-full lg:w-70 shrink-0">
            <ExportReportPanel
              data={exportConfig.data}
              filename={exportConfig.filename}
              columns={exportConfig.columns}
              chartCaptureIds={["report-chart-capture"]}
              getData={
                status === "authenticated"
                  ? async () => {
                      if (tableTab === "sales") {
                        const orders = await orderService.getAll({
                          page: 1,
                          limit: 1000,
                        });
                        const enriched = await enrichOrdersWithItems(orders);
                        return enriched.map(mapOrderToSaleRow) as Record<string, unknown>[];
                      }
                      if (tableTab === "expenses") {
                        const rows = await expenseApi.getExpenses(session);
                        return rows.map(mapExpense) as Record<string, unknown>[];
                      }
                      const rows = await productService.getAll();
                      return rows.map(mapProductToReportRow) as Record<string, unknown>[];
                    }
                  : undefined
              }
              pdfOptions={{
                title: exportConfig.title,
                subtitle: exportConfig.subtitle,
                footer: "Generated by Coca POS - Reports System",
              }}
            />
            {exportLoading && (
              <p
                className="mt-2 text-[11px] text-gray-400"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Syncing latest data for export...
              </p>
            )}
          </div>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={`Search ${tableTab}...`}
          debounceMs={300}
        />

        <ReportActionsBar
          activeTab={tableTab}
          onTabChange={handleTabChange}
          hasSelection={hasSelection}
          onViewDetails={handleViewDetails}
        />

        <ReportTable
          activeTab={tableTab}
          search={search}
          dateRange={statDateRange}
          selectedSale={selectedSale}
          onSelectSale={setSelectedSale}
          selectedExpense={selectedExpense}
          onSelectExpense={setSelectedExpense}
          selectedProduct={selectedProduct}
          onSelectProduct={setSelectedProduct}
        />
      </div>
    </DashboardLayout>
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

function formatOrderItems(items: Order["items"]): string {
  if (!items || items.length === 0) return "-";
  return items.map((i) => `${i.qty}x ${i.name}`).join("\n");
}

async function enrichOrdersWithItems(orders: Order[], maxConcurrency = 6) {
  const results: Order[] = new Array(orders.length);
  let cursor = 0;

  async function worker() {
    while (cursor < orders.length) {
      const index = cursor++;
      const order = orders[index];

      if (order.items && order.items.length > 0) {
        results[index] = order;
        continue;
      }

      try {
        results[index] = await orderService.getById(order.id);
      } catch {
        results[index] = order;
      }
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(maxConcurrency, orders.length) }, worker)
  );

  return results;
}

const mapOrderToSaleRow = (order: Order): SaleRow => ({
  id: order.id,
  date: order.dateTime ? new Date(order.dateTime).toISOString().split("T")[0] : "",
  invoiceId: order.orderNumber ?? "Unknown",
  customer: order.customer ?? "Unknown Customer",
  items: formatOrderItems(order.items),
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

function mapProductToReportRow(product: Product): ProductReportRow {
  const variants = product.variants ?? [];

  const basePrices = variants.map((v) =>
    Number(v?.basePrice ?? v?.price ?? 0)
  );
  const sellingPrices = variants.map((v) =>
    Number(v?.sellingPrice ?? v?.price ?? 0)
  );
  const totalStock = variants.reduce(
    (sum: number, v) => sum + Number(v?.stockQty ?? 0),
    0
  );

  const allSkus = variants.map((v) => v?.sku).filter(Boolean).join(", ");

  let stockStatus: ProductReportRow["stockStatus"] = "In Stock";
  for (const v of variants) {
    const qty = Number(v?.stockQty ?? 0);
    const low = Number(v?.lowStock ?? 0);
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