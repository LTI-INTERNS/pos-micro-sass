"use client";

import { useMemo, useState } from "react";
import ModalShell from "../../Admin/common/ModalShell";
import SearchBar from "../../Admin/common/Search-bar";
import CommonTable, { Column } from "../../Admin/common/CommonTable";
import { ordersData, Order } from "@/app/ordermanagement/data";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PreviousOrdersModal({ open, onClose }: Props) {
  const { currency } = useCurrency();
  const [search, setSearch] = useState("");

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ordersData;

    return ordersData.filter(
      (o) =>
        String(o.id).includes(q) ||
        o.cashier?.toLowerCase().includes(q)
    );
  }, [search]);

  const columns: Column<Order>[] = [
    { key: "id", label: "Order ID" },
    { key: "dateTime", label: "Date & Time" },
    { key: "cashier", label: "Cashier" },
    { key: "paymenttype", label: "Payment" },
    {
      key: "totalamount",
      label: "Total Amount",
      render: (row) => row.totalamount !== undefined 
        ? formatCurrency(row.totalamount, currency) 
        : "-",
    },
    { key: "status", label: "Status" },
    {
      key: "action",
      label: "Action",
      render: () => (
        <span className="text-orange-500 font-semibold cursor-pointer">
          View
        </span>
      ),
    },
  ];

  return (
    <ModalShell
      open={open}
      title="Previous Orders"
      onClose={onClose}
      widthClassName="w-[1100px] max-w-[95vw]"
    >
      <div className="space-y-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by Order ID or Cashier"
          showFilter={false}
        />

        <CommonTable
          data={filteredOrders}
          columns={columns}
          emptyMessage="No orders found"
        />
      </div>
    </ModalShell>
  );
}
