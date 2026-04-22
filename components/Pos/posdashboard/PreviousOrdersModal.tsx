"use client";

import { useMemo, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ModalShell from "@/components/Admin/common/ModalShell";
import SearchBar from "@/components/Admin/common/Search-bar";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { orderService } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import PreviousOrderDetailsModal from "@/components/Pos/posdashboard/PreviousOrderDetailsModal";
import type { Order } from "@/types/order.types";

type Props = {
  open: boolean;
  onClose: () => void;
};

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default function PreviousOrdersModal({ open, onClose }: Props) {
  const { data: session } = useSession();
  const branchId = session?.user?.branchId ?? "";

  const { currency, useCents } = useCurrency();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [search, setSearch] = useState("");

  const [detailsOpen, setDetailsOpen]     = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!open || !branchId) return;

    let cancelled = false;

    (async () => {
      try {
        setIsLoading(true);
        setFetchError("");

        const data = await orderService.getAll({
          branchId,
          startDate: daysAgo(7),
          limit: 100,
        });

        if (!cancelled) {
          setAllOrders(data);
          setTotalCount(data.length);
        }
      } catch {
        if (!cancelled) setFetchError("Failed to load orders.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [open, branchId]);

  useEffect(() => {
    if (!open) {
      setAllOrders([]);
      setTotalCount(0);
      setSearch("");
      setFetchError("");
      setSelectedOrder(null);
      setDetailsOpen(false);
    }
  }, [open]);
  // ── Client-side search ─────────────────────────────────────────────────
  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return allOrders;
    return allOrders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        (o.cashier ?? "").toLowerCase().includes(q) ||
        (o.customer ?? "").toLowerCase().includes(q)
    );
  }, [search, allOrders]);

  const columns: Column<Order>[] = [
    {
      key:    "orderNumber",
      label:  "Order No.",
    },
    {
      key:    "dateTime",
      label:  "Date & Time",
      render: (row) =>
        row.dateTime ? new Date(row.dateTime).toLocaleString() : "-",
    },
    { key: "cashier",     label: "Cashier"  },
    { key: "customer",    label: "Customer" },
    { key: "paymenttype", label: "Payment"  },
    {
      key:    "totalamount",
      label:  "Total",
      align:  "right",
      render: (row) =>
        row.totalamount !== undefined
          ? formatCurrency(row.totalamount, currency, useCents)
          : "-",
    },
    {
      key:    "status",
      label:  "Status",
      render: (row) => {
        const s = (row.status ?? "").toUpperCase();
        const styles: Record<string, string> = {
          COMPLETED: "bg-green-100 text-green-700",
          PENDING:   "bg-yellow-100 text-yellow-700",
          CANCELED:  "bg-red-100 text-red-600",
        };
        return (
          <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[s] ?? "bg-gray-100 text-gray-600"}`}>
            {row.status ?? "-"}
          </span>
        );
      },
    },
  ];

  const handleSelectRow = (row: Order | null) => {
    if (!row) return;
    setSelectedOrder(row);
    setDetailsOpen(true);
  };

  return (
    <>
      <ModalShell
        open={open}
        title="Previous Orders (Last 7 Days)"
        onClose={onClose}
        widthClassName="w-[1100px] max-w-[95vw]"
      >
        <div className="space-y-4">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by order number, cashier, or customer…"
            showFilter={false}
          />

          {fetchError && (
            <p className="text-sm text-red-500">{fetchError}</p>
          )}

          {isLoading ? (
            <div className="py-10 text-center text-sm text-gray-400">
              Loading orders…
            </div>
          ) : (
            <>
              <div className="max-h-[400px] overflow-y-auto">
                <CommonTable
                  data={filteredOrders}
                  columns={columns}
                  emptyMessage="No orders found in the last 7 days"
                  onSelectRow={handleSelectRow}
                />
              </div>
              {totalCount > 0 && (
                <p className="text-xs text-gray-400 text-right pt-1">
                  {search.trim()
                    ? `Showing ${filteredOrders.length} of ${totalCount} orders`
                    : `${totalCount} order${totalCount !== 1 ? "s" : ""} in the last 7 days`}
                </p>
              )}
            </>
          )}
        </div>
      </ModalShell>

      <PreviousOrderDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selectedOrder}
      />
    </>
  );
}