"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import {
  SALES_DATA,   type SaleRow,
  EXPENSES_DATA, type ExpenseRow,
  PRODUCTS_DATA, type ProductRow,
} from "@/app/reports/reportsMockData";

const SALE_COLS: Column<SaleRow>[] = [
  { key: "date",          label: "Date"           },
  { key: "invoiceId",     label: "Invoice ID"     },
  { key: "customer",      label: "Customer"       },
  { key: "items",         label: "Items",  align: "center" },
  { key: "paymentMethod", label: "Payment Method" },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      const styles: Record<SaleRow["status"], string> = {
        Completed: "text-green-600 bg-green-50",
        Refunded:  "text-red-500   bg-red-50",
        Pending:   "text-yellow-600 bg-yellow-50",
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
    render: (row) => `$${row.amount.toFixed(2)}`,
  },
];

const EXPENSE_COLS: Column<ExpenseRow>[] = [
  { key: "date",        label: "Date"        },
  { key: "category",    label: "Category"    },
  { key: "description", label: "Description" },
  { key: "approvedBy",  label: "Approved By" },
  {
    key: "amount",
    label: "Amount",
    align: "right",
    render: (row) => `$${row.amount.toFixed(2)}`,
  },
];

const PRODUCT_COLS: Column<ProductRow>[] = [
  { key: "sku",      label: "SKU"          },
  { key: "name",     label: "Product Name" },
  { key: "category", label: "Category"     },
  { key: "unitsSold", label: "Units Sold", align: "center" },
  {
    key: "revenue",
    label: "Revenue",
    align: "right",
    render: (row) => `$${row.revenue.toFixed(2)}`,
  },
  {
    key: "stock",
    label: "Stock Left",
    align: "center",
    render: (row) => (
      <span className={row.stock < 50 ? "text-red-500 font-semibold" : "text-gray-700"}>
        {row.stock}
      </span>
    ),
  },
];

type Props = {
  activeTab: string;
  search: string;

  selectedSale:    SaleRow    | null;
  selectedExpense: ExpenseRow | null;
  selectedProduct: ProductRow | null;

  onSelectSale:    (row: SaleRow    | null) => void;
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

export default function ReportTable({
  activeTab,
  search,
  selectedSale,    onSelectSale,
  selectedExpense, onSelectExpense,
  selectedProduct, onSelectProduct,
}: Props) {
  if (activeTab === "expenses") {
    const filtered = filterRows<ExpenseRow>(
      EXPENSES_DATA, search, ["date", "category", "description", "approvedBy"]
    );
    return (
      <CommonTable<ExpenseRow>
        title="Expense Records"
        data={filtered}
        columns={EXPENSE_COLS}
        emptyMessage="No expenses found"
        selectedRowId={selectedExpense?.id}
        onSelectRow={onSelectExpense}
      />
    );
  }

  if (activeTab === "products") {
    const filtered = filterRows<ProductRow>(
      PRODUCTS_DATA, search, ["sku", "name", "category"]
    );
    return (
      <CommonTable<ProductRow>
        title="Top Products"
        data={filtered}
        columns={PRODUCT_COLS}
        emptyMessage="No products found"
        selectedRowId={selectedProduct?.id}
        onSelectRow={onSelectProduct}
      />
    );
  }

  const filtered = filterRows<SaleRow>(
    SALES_DATA, search, ["date", "invoiceId", "customer", "paymentMethod", "status"]
  );
  return (
    <CommonTable<SaleRow>
      title="Sales Transactions"
      data={filtered}
      columns={SALE_COLS}
      emptyMessage="No sales found"
      selectedRowId={selectedSale?.id}
      onSelectRow={onSelectSale}
    />
  );
}
