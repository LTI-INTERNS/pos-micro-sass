"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/app/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/app/components/Admin/customermanagement/customers-table";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import StatCardGrid from "@/app/components/Admin/customermanagement/customerStarGrid";
import { customersData } from "./data";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import { useTableFilters, getFilterOptions } from "@/app/components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";

type Customer = {
  id: number;
  name: string;
  phone: string;
  promoCard: string;
  points: number;
  email: string;
  outstanding: number;
};

export default function CustomersPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [filters, setFilters] = useState<{
    name?: string;
    promoCard?: string;
  }>({});
    const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const nameOptions = getFilterOptions(customersData, "name");
  const promoCardOptions = getFilterOptions(customersData, "promoCard");

  const filteredCustomers = useTableFilters<Customer>({
    data: customersData as Customer[],
    search,
    start,
    end,
    searchKeys: ["id", "name", "email", "promoCard"],
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
            placeholder="Search Customers..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={[
              {
                name: "name",
                placeholder: "Customer Name",
                options: nameOptions,
              },
              {
                name: "promoCard",
                placeholder: "Promo Card",
                options: promoCardOptions,
              },
            ]}
          />
        </div>
        <div className="grid grid-cols-1 gap-3">
          <FilterChips filters={filters} onRemove={handleRemoveFilter} />
          <CustomerActionsBar
          />
        </div>

        <CustomersTable customers={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
}
