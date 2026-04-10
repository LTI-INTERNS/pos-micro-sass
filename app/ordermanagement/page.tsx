"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/ordermanagement/orderStarCardGrid";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import OrdersTable from "@/components/Admin/ordermanagement/order-table";
import OrderBillModal from "@/components/Admin/ordermanagement/orderReceiptPreviewModel";
import FilterChips from "@/components/Admin/common/FilterChips";
import { orderService } from "@/lib/services";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import type { Order } from "@/types/order.types";

// ── Role gate ─────────────────────────────────────────────────────────────────

const ALLOWED_ROLES = ["OWNER", "ADMIN", "MANAGER"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function isAllowedRole(role: string): role is AllowedRole {
  return (ALLOWED_ROLES as readonly string[]).includes(role);
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function OrderManagementPage() {
  // ── Session ─────────────────────────────────────────────────────────────
  const { data: session, status: sessionStatus } = useSession();

  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";

  /**
   * OWNER / ADMIN → no branchId filter → backend returns all company orders.
   * MANAGER       → branchId passed    → backend scopes to their branch only.
   */
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  // ── Data state ──────────────────────────────────────────────────────────
  const [allOrders, setAllOrders]   = useState<Order[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [fetchError, setFetchError] = useState("");

  // ── UI state ────────────────────────────────────────────────────────────
  const [start, setStart]                 = useState<Date | undefined>();
  const [end, setEnd]                     = useState<Date | undefined>();
  const [search, setSearch]               = useState("");
  const [showFilter, setShowFilter]       = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [billOpen, setBillOpen]           = useState(false);

  const [filters, setFilters] = useState<{
    branch?: string;
    paymenttype?: string;
    status?: string;
  }>({});

  // ── Fetch orders ─────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (!isAllowedRole(role)) return;

    try {
      setIsLoading(true);
      setFetchError("");

      const data = await orderService.getAll(
        canSeeAllBranches ? undefined : { branchId }
      );

      setAllOrders(data);
    } catch {
      setFetchError("Failed to load orders. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [role, branchId, canSeeAllBranches]);

  useEffect(() => {
    if (sessionStatus !== "loading") fetchOrders();
  }, [fetchOrders, sessionStatus]);

  // ── Hide branch filter for roles that can't use it ───────────────────────
  useEffect(() => {
    if (!canSeeAllBranches) {
      setFilters((prev) => ({ ...prev, branch: "" }));
    }
  }, [canSeeAllBranches]);

  // ── Filter helpers ───────────────────────────────────────────────────────
  const visibleFilters = canSeeAllBranches
    ? filters
    : Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "branch")
      );

  const isFilterApplied = Object.values(visibleFilters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    if (!canSeeAllBranches && key === "branch") return;
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => setFilters({});

  // ── Filter option lists ──────────────────────────────────────────────────
  const statusOptions = getFilterOptions(allOrders, "status");

  const branchOptions = useMemo(
    () => getFilterOptions(allOrders, "branch"),
    [allOrders]
  );

  const paymentTypeOptions = [
    { label: "Cash",  value: "CASH"  },
    { label: "Card",  value: "CARD"  },
    { label: "Split", value: "SPLIT" },
  ];

  const filterFields: SelectField[] = useMemo(
    () => [
      ...(canSeeAllBranches
        ? [{ name: "branch", placeholder: "Select Branch", options: branchOptions } as SelectField]
        : []),
      { name: "paymenttype", placeholder: "Select Payment Type", options: paymentTypeOptions },
      { name: "status",      placeholder: "Select Status",       options: statusOptions      },
    ],
    [canSeeAllBranches, branchOptions, statusOptions]
  );

  // ── Client-side filtering ────────────────────────────────────────────────
  const filteredOrders = useTableFilters<Order>({
    data:       allOrders,
    search,
    start,
    end,
    dateKey:    "dateTime",
    searchKeys: ["orderNumber", "cashier"],
    filters:    canSeeAllBranches ? filters : { ...filters, branch: "" },
  });

  // ── View bill ────────────────────────────────────────────────────────────
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setReceiptOpen(true);
  };

  // ── Loading / access guard ───────────────────────────────────────────────
  if (sessionStatus === "loading") {
    return (
      <DashboardLayout>
        <div className="w-full p-4 text-gray-400 text-sm">Loading session…</div>
      </DashboardLayout>
    );
  }

  if (!isAllowedRole(role)) {
    return (
      <DashboardLayout>
        <div className="w-full p-4 text-red-500 text-sm">
          You do not have permission to view this page.
        </div>
      </DashboardLayout>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <DashboardLayout>
      <div className="w-full space-y-5">

        {/* Date range */}
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => { setStart(s); setEnd(e); }}
        />

        {/* Stat cards */}
        <StatCardGrid />

        {/* Error banner */}
        {fetchError && (
          <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 flex items-center justify-between">
            <span>{fetchError}</span>
            <button
              type="button"
              onClick={fetchOrders}
              className="ml-4 rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search + filters */}
        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by order number or cashier…"
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
              setFilters(canSeeAllBranches ? values : { ...values, branch: "" });
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        {/* Orders table */}
        {isLoading ? (
          <div className="w-full py-10 text-center text-sm text-gray-400">
            Loading orders…
          </div>
        ) : (
          <OrdersTable orders={filteredOrders} onView={handleViewOrder} />
        )}

        {/* Bill modal — read-only receipt view */}
        <OrderBillModal
          open={billOpen}
          onClose={() => setBillOpen(false)}
          order={selectedOrder}
        />
      </div>
    </DashboardLayout>
  );
}