"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/app/components/Admin/ordermanagement/orderStarCardGrid";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import OrdersTable from "@/app/components/Admin/ordermanagement/order-table";
import { ordersData } from "./data";
import { useTableFilters, getFilterOptions } from "@/app/components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";

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

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const branchOptions = getFilterOptions(ordersData as Order[], "branch");
  const paymentTypeOptions = getFilterOptions(ordersData as Order[], "paymenttype");
  const statusOptions = getFilterOptions(ordersData as Order[], "status");

  const filterFields: SelectField[] = [
    {
      name: "branch",
      placeholder: "Select Branch",
      options: branchOptions,
    },
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

  const filteredOrders = useTableFilters<Order>({
    data: ordersData as Order[],
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
        <StatCardGrid />

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
