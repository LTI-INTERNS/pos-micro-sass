"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/ordermanagement/orderStarCardGrid";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import OrdersTable from "@/components/Admin/ordermanagement/order-table";
import { orderService } from "@/lib/services";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import OrderReceiptPreviewModal from "@/components/Admin/ordermanagement/orderReceiptPreviewModel";

export type OrderItem = {
  name: string;
  qty: number;
  price: number;
  total: number;
};

export type Order = {
  id: number;
  dateTime?: string;
  branch?: string;
  cashier?: string;
  paymenttype?: string;
  totalamount?: number;
  status?: string;
  action?: string;
  customer?: string;
  items?: OrderItem[];
};

type UserRole = "OWNER" | "ADMIN" | "MANAGER" | "CASHIER" | "BRANCH_SESSION";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const [filters, setFilters] = useState<{
    branch?: string;
    paymenttype?: string;
    status?: string;
  }>({});

  useEffect(() => {
    orderService.getAll().then((data) => {
      const normalized = (data as Order[]).map((order) => ({
        ...order,
        customer: order.customer ?? "Walk-in Customer",
        items:
          order.items && order.items.length > 0
            ? order.items
            : [
                {
                  name: "Sample Item 1",
                  qty: 2,
                  price: 500,
                  total: 1000,
                },
                {
                  name: "Sample Item 2",
                  qty: 1,
                  price: 750,
                  total: 750,
                },
              ],
      }));

      setAllOrders(normalized);
    });
  }, []);

  const userRole = session?.user?.role as UserRole | undefined;
  const userBranch = session?.user?.branchName ?? "";

  const isOwner = userRole === "OWNER";
  const isAdmin = userRole === "ADMIN";
  const canUseBranchFilter = isOwner || isAdmin;

  const normalize = (value?: string) => (value ?? "").trim().toLowerCase();

  const baseData = useMemo(() => {
    if (status === "loading") return [];

    if (isOwner) return allOrders;

    if (!userBranch.trim()) return allOrders;

    return allOrders.filter(
      (o) => normalize(o.branch) === normalize(userBranch)
    );
  }, [status, isOwner, userBranch, allOrders]);

  useEffect(() => {
    if (!canUseBranchFilter) {
      setFilters((prev) => ({ ...prev, branch: "" }));
    }
  }, [canUseBranchFilter]);

  const visibleFilters = canUseBranchFilter
    ? filters
    : Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "branch")
      );

  const isFilterApplied = Object.values(visibleFilters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    if (!canUseBranchFilter && key === "branch") return;

    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const statusOptions = getFilterOptions(baseData as Order[], "status");

  const branchOptions = useMemo(() => {
    return getFilterOptions(allOrders as Order[], "branch");
  }, [allOrders]);

  const paymentTypeOptions = [
    { label: "Cash", value: "Cash" },
    { label: "Card", value: "Card" },
    { label: "Split", value: "Split" },
  ];

  const filterFields: SelectField[] = useMemo(() => {
    return [
      ...(canUseBranchFilter
        ? [
            {
              name: "branch",
              placeholder: "Select Branch",
              options: branchOptions,
            } as SelectField,
          ]
        : []),
      {
        name: "paymenttype",
        placeholder: "Select Payment Type",
        options: paymentTypeOptions,
      },
      {
        name: "status",
        placeholder: "Select Status",
        options: statusOptions,
      },
    ];
  }, [canUseBranchFilter, branchOptions, statusOptions]);

  const filteredOrders = useTableFilters<Order>({
    data: baseData as Order[],
    search,
    start,
    end,
    dateKey: "dateTime",
    searchKeys: ["id", "cashier"],
    filters: canUseBranchFilter ? filters : { ...filters, branch: "" },
  });

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setReceiptOpen(true);
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="w-full p-4">Loading orders...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />

        <StatCardGrid orders={filteredOrders} />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search orders..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />

          <FilterChips filters={visibleFilters} onRemove={handleRemoveFilter} />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              const nextValues = canUseBranchFilter
                ? values
                : { ...values, branch: "" };

              setFilters(nextValues);
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        <OrdersTable orders={filteredOrders} onView={handleViewOrder} />

        <OrderReceiptPreviewModal
          open={receiptOpen}
          onClose={() => setReceiptOpen(false)}
          order={selectedOrder}
        />
      </div>
    </DashboardLayout>
  );
}