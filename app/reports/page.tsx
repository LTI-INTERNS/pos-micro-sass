"use client";

import { useMemo, useState } from "react";
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
import {
  SALES_DATA,    SALE_COLUMNS,
  EXPENSES_DATA, EXPENSE_COLUMNS,
  PRODUCTS_DATA, PRODUCT_COLUMNS,
} from "@/app/reports/reportsMockData";

type UserRole = "superadmin" | "admin" | "manager";

const mockSession = {
  role: "superadmin" as UserRole,
  name: "John Doe",
  branch: "Colombo",
};

type TableTab = "sales" | "expenses" | "products";

type ExportConfig = {
  data: Record<string, unknown>[];
  columns: ExportColumn[];
  filename: string;
  title: string;
  subtitle: string;
};

export default function ReportsPage() {
  const [search,    setSearch]    = useState("");
  const [chartTab,  setChartTab]  = useState("sales-trends");
  const [tableTab,  setTableTab]  = useState<TableTab>("sales");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate,   setEndDate]   = useState<Date | undefined>();

  const statDateRange = useMemo(() => {
    if (!startDate || !endDate) return undefined;
    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  }, [startDate, endDate]);

  const [selectedSale,    setSelectedSale]    = useState<SaleRow    | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseRow | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);

  const isSuperAdmin = mockSession.role === "superadmin";

  // Superadmin sees all; admin/manager sees their branch only
  const salesData = isSuperAdmin
    ? SALES_DATA
    : SALES_DATA.filter((r) => r.branch === mockSession.branch);

  const expensesData = isSuperAdmin
    ? EXPENSES_DATA
    : EXPENSES_DATA.filter((r) => r.branch === mockSession.branch);

  // Products are a global catalogue — if want add branch filter

  const branchLabel = isSuperAdmin ? "All Branches" : mockSession.branch;

  const EXPORT_CONFIGS: Record<TableTab, ExportConfig> = {
    sales: {
      data:     salesData as Record<string, unknown>[],
      columns:  SALE_COLUMNS,
      filename: "sales-report",
      title:    "Sales Report",
      subtitle: `${branchLabel} – Sales`,
    },
    expenses: {
      data:     expensesData as Record<string, unknown>[],
      columns:  EXPENSE_COLUMNS,
      filename: "expenses-report",
      title:    "Expenses Report",
      subtitle: `${branchLabel} – Expenses`,
    },
    products: {
      data:     PRODUCTS_DATA as Record<string, unknown>[],
      columns:  PRODUCT_COLUMNS,
      filename: "products-report",
      title:    "Products Report",
      subtitle: "Top selling products",
    },
  };

  const exportConfig = EXPORT_CONFIGS[tableTab];

  const hasSelection =
    (tableTab === "sales"    && selectedSale    !== null) ||
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
    if (tableTab === "sales"    && selectedSale)
      alert(`Invoice: ${selectedSale.invoiceId}\nCustomer: ${selectedSale.customer}\nAmount: $${selectedSale.amount}\nBranch: ${selectedSale.branch}`);
    if (tableTab === "expenses" && selectedExpense)
      alert(`Category: ${selectedExpense.category}\nDesc: ${selectedExpense.description}\nAmount: $${selectedExpense.amount}\nBranch: ${selectedExpense.branch}`);
    if (tableTab === "products" && selectedProduct)
      alert(`SKU: ${selectedProduct.sku}\nProduct: ${selectedProduct.name}\nRevenue: $${selectedProduct.revenue}`);
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">

        <ReportStatCardGrid
          sales={salesData}
          expenses={expensesData}
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
            dateRange={startDate && endDate ? {
              startDate: startDate.toISOString().split('T')[0],
              endDate: endDate.toISOString().split('T')[0],
            } : undefined}
          />

          <div className="w-full lg:w-70 shrink-0">
            <ExportReportPanel
              data={exportConfig.data}
              filename={exportConfig.filename}
              columns={exportConfig.columns}
              pdfOptions={{
                title:    exportConfig.title,
                subtitle: exportConfig.subtitle,
                footer:   "Generated by Coca POS – Reports System",
              }}
            />
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
          selectedSale={selectedSale}       onSelectSale={setSelectedSale}
          selectedExpense={selectedExpense} onSelectExpense={setSelectedExpense}
          selectedProduct={selectedProduct} onSelectProduct={setSelectedProduct}
        />

      </div>
    </DashboardLayout>
  );
}
