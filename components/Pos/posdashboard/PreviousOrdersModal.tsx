"use client";

import { useMemo, useState } from "react";
import ModalShell from "../../Admin/common/ModalShell";
import SearchBar from "../../Admin/common/Search-bar";
import CommonTable, { Column } from "../../Admin/common/CommonTable";
import { ordersData, Order } from "@/app/ordermanagement/data";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

import PreviousOrderDetailsModal from "./PreviousOrderDetailsModal";
import { previousOrderDetailsMap } from "@/app/ordermanagement/previousOrderDetailsMock";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function PreviousOrdersModal({ open, onClose }: Props) {
  const { currency, useCents } = useCurrency();
  const [search, setSearch] = useState("");

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const selectedDetails = selectedOrderId ? previousOrderDetailsMap[selectedOrderId] ?? null : null;

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ordersData;

    return ordersData.filter((o) => String(o.id).includes(q) || o.cashier?.toLowerCase().includes(q));
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
        ? formatCurrency(row.totalamount, currency, useCents) 
        : "-",
    },
    { key: "status", label: "Status" },
  ];

  return (
    <>
      <ModalShell open={open} title="Previous Orders" onClose={onClose} widthClassName="w-[1100px] max-w-[95vw]">
        <div className="space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by Order ID or Cashier"
            showFilter={false}
          />
         <div className="mb-4 max-h-50 overflow-y-auto">

          <CommonTable
            data={filteredOrders}
            columns={columns}
            emptyMessage="No orders found"
            onSelectRow={(row) => {
              if (!row) return;

              setSelectedOrderId(Number(row.id));
              setDetailsOpen(true);
            }}
          />
         </div>
          
        </div>
      </ModalShell>

      <PreviousOrderDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        details={selectedDetails}
      />
    </>
  );
}