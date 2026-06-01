"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/components/Admin/customermanagement/customers-table";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import StatCardGrid from "@/components/Admin/customermanagement/customerStarGrid";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useTableFilters } from "@/components/Admin/common/Filterlogic";
import { customerService } from "@/lib/services/customer-service";
import { queryKeys } from "@/lib/query-keys";
import type { Customer } from "@/types/customer.types";

// THE FIX: Import our global toast system
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

const ALLOWED_ROLES = ["OWNER", "ADMIN", "MANAGER"] as const;
type AllowedRole = (typeof ALLOWED_ROLES)[number];

function isAllowedRole(role: string): role is AllowedRole {
  return (ALLOWED_ROLES as readonly string[]).includes(role);
}

export default function CustomersPage() {
  const { data: session, status } = useSession();
  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";
  const queryClient = useQueryClient();

  // THE FIX: Initialize the toast hook
  const { toasts, showToast, dismissToast } = useToast();

  const [start, setStart]                       = useState<Date | undefined>();
  const [end, setEnd]                           = useState<Date | undefined>();
  const [search, setSearch]                     = useState("");
  const [showFilter, setShowFilter]             = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [filters, setFilters]                   = useState<{ points?: string; branch?: string; status?: string }>({});

  const effectiveBranchId = canSeeAllBranches ? undefined : branchId;
  const customersQuery = useQuery({
    queryKey: queryKeys.customers.list(effectiveBranchId),
    queryFn: () => customerService.getAll(effectiveBranchId),
    enabled: status === "authenticated" && isAllowedRole(role),
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
  const customers = useMemo(() => customersQuery.data ?? [], [customersQuery.data]);
  const isLoading = customersQuery.isLoading;
  const fetchError = customersQuery.isError
    ? "Failed to load customers. Please try again."
    : "";

  const branchOptions = useMemo(
    () =>
      canSeeAllBranches
        ? Array.from(new Set(customers.map((c) => c.branch.name).filter(Boolean))).map(
            (b) => ({ label: b, value: b })
          )
        : [],
    [customers, canSeeAllBranches]
  );

  const filterFields: SelectField[] = useMemo(
    () => [
      ...(canSeeAllBranches
        ? [{ name: "branch", placeholder: "Select Branch", options: branchOptions } as SelectField]
        : []),
      {
        name: "status",
        placeholder: "Select Status",
        options: [
          { label: "Active",   value: "active"   },
          { label: "Inactive", value: "inactive" },
        ],
      },
      {
        name: "points",
        placeholder: "Select Points Range",
        options: [
        { label: "Below 50", value: "lt50" },
        { label: "50 - 100", value: "50-100" },
        { label: "Above 100", value: "gt100" },
        ],
      },
    ],
    [canSeeAllBranches, branchOptions]
  );

  const baseFiltered = useTableFilters<Customer>({
    data:       customers,
    search,
    start,
    end,
    searchKeys: ["id", "name", "email", "phone", "promoCard"],
    dateKey:    "createdAt",
    filters:    {},
  });

  const filteredCustomers = useMemo(
    () =>
      baseFiltered.filter((c) => {
        if (filters.branch && c.branch.name !== filters.branch)                return false;
        if (filters.status === "active"   && !c.activeState)                   return false;
        if (filters.status === "inactive" &&  c.activeState)                   return false;
        if (filters.points === "lt50"   && c.points >= 50)                     return false;
        if (filters.points === "50-100" && (c.points < 50 || c.points > 100))  return false;
        if (filters.points === "gt100"  && c.points <= 100)                    return false;
        return true;
      }),
    [baseFiltered, filters]
  );

  const isFilterApplied    = Object.values(filters).some((v) => v && v.trim() !== "");
  const handleRemoveFilter = (key: string) => setFilters((prev) => ({ ...prev, [key]: "" }));
  const clearAllFilters    = () => setFilters({});

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    setSelectedCustomer(null);
    void queryClient.invalidateQueries({ queryKey: queryKeys.customers.list(effectiveBranchId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats(effectiveBranchId) });
  };

  const handleEditCustomer = (updatedCustomer: Customer) => {
    setSelectedCustomer(updatedCustomer);
    void queryClient.invalidateQueries({ queryKey: queryKeys.customers.list(effectiveBranchId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats(effectiveBranchId) });
  };

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Loading...
        </div>
      </DashboardLayout>
    );
  }

  if (status === "unauthenticated" || !isAllowedRole(role)) {
    redirect("/login");
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

        <StatCardGrid />

        {fetchError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {fetchError}
          </div>
        )}

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Customers..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />

          <FilterChips
            filters={filters}
            onRemove={handleRemoveFilter}
          />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values as typeof filters);
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        <CustomerActionsBar
          selectedCustomer={selectedCustomer}
          onAdd={() => {
            void queryClient.invalidateQueries({ queryKey: queryKeys.customers.list(effectiveBranchId) });
            void queryClient.invalidateQueries({ queryKey: queryKeys.customers.stats(effectiveBranchId) });
          }}
          onDelete={handleDeleteCustomer}
          onEdit={handleEditCustomer}
          showToast={showToast} // Pass showToast down to actions bar
        />

        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-gray-500 text-sm">
            Loading customers...
          </div>
        ) : (
          <CustomersTable
            customers={filteredCustomers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
          />
        )}
      </div>

      {/* THE FIX: Render ToastNotification at the bottom */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}