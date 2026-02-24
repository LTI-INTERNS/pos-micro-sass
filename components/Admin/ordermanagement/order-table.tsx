"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Order } from "@/lib/mocks/ordermanagement";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export default function OrdersTable({ orders }: { orders: Order[] }) {
    const { currency, useCents } = useCurrency();

    const orderColumns: Column<Order>[] = [
    { key: "id", label: "Order ID" },
    { key: "dateTime", label: "Date & Time" },
    { key: "branch", label: "Branch" },
    { key: "cashier", label: "Cashier" },
    { key: "paymenttype", label: "Payment" },
    { key: "totalamount", label: "Total Amount", align: "right", render: (row) => row.totalamount !== undefined ? formatCurrency(row.totalamount, currency, useCents) : "-" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  return (
    <CommonTable
      title="Orders"
      data={orders}
      columns={orderColumns}
    />
  );
}
