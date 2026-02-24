"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/ordermanagement/orderStarCardGrid";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import OrdersTable from "@/components/Admin/ordermanagement/order-table";
import { ordersData } from "@/lib/mocks/ordermanagement";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";

type Order = {
  id: number;
  dateTime?: string;
  branch?: string;
  cashier?: string;
  paymenttype?: string;
  totalamount?: number;
  status?: string;
  action?: string;
};

type UserRole = "superadmin" | "admin" | "manager";

export default function DashboardPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<{
    branch?: string;
    paymenttype?: string;
    status?: string;
  }>({});

  // TODO: Replace with actual auth session/role + branch
  const userRole: UserRole = "superadmin" as UserRole;
  const userBranch = "Colombo 01" as const; // Get from auth context/session

  // Base data: superadmin sees all; admin/manager only their branch
  const baseData = useMemo(() => {
    const all = ordersData as Order[];
    return userRole === "superadmin"
      ? all
      : all.filter((o) => o.branch === userBranch);
  }, [userRole, userBranch]);

  // Optional but recommended: ensure branch filter isn't kept for admin/manager
  useEffect(() => {
    if (userRole !== "superadmin") {
      setFilters((prev) => ({ ...prev, branch: "" }));
    }
  }, [userRole]);

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  // Filter options (use baseData so admin/manager don't get other-branch options)
  const paymentTypeOptions = getFilterOptions(baseData as Order[], "paymenttype");
  const statusOptions = getFilterOptions(baseData as Order[], "status");

  // Branch options only needed for superadmin
  const branchOptions = useMemo(() => {
    return getFilterOptions(ordersData as Order[], "branch");
  }, []);

  const filterFields: SelectField[] = useMemo(() => {
    return [
      ...(userRole === "superadmin"
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
  }, [userRole, branchOptions, paymentTypeOptions, statusOptions]);

  const filteredOrders = useTableFilters<Order>({
    data: baseData as Order[],
    search,
    start,
    end,
    dateKey: "dateTime",
    searchKeys: ["id", "cashier"],
    filters,
  });

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

        {/* NOTE ABOUT STATS:
           This will still show whatever StatCardGrid calculates internally.
           If StatCardGrid currently uses ordersData inside itself, you must update that component
           to accept a prop (e.g. orders={filteredOrders} or data={baseData}) to make stats role-based.
        */}
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

          <FilterChips filters={filters} onRemove={handleRemoveFilter} />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        <OrdersTable orders={filteredOrders} />
      </div>
    </DashboardLayout>
  );
}