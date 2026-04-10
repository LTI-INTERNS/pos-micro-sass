"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Order } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type OrdersTableProps = {
  orders: Order[];
  onView: (order: Order) => void;
};

export default function OrdersTable({ orders, onView }: OrdersTableProps) {
  const { currency, useCents } = useCurrency();

  const orderColumns: Column<Order>[] = [
    {
    key: "index",
    label: "",
    render: (_, index) => index + 1,
  },
    { key: "id", label: "Order ID" },
    { key: "dateTime", label: "Date & Time" },
    { key: "branch", label: "Branch" },
    { key: "cashier", label: "Cashier" },
    { key: "paymenttype", label: "Payment" },
    {
      key: "totalamount",
      label: "Total Amount",
      align: "right",
      render: (row) =>
        row.totalamount !== undefined
          ? formatCurrency(row.totalamount, currency, useCents)
          : "-",
    },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <button
          type="button"
          onClick={() => onView(row)}
          className="rounded-md bg-orange-500 px-3 py-1 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <CommonTable
      title="Orders"
      data={orders}
      columns={orderColumns}
      emptyMessage="No orders found"
    />
  );
}