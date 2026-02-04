"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/app/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/app/components/Admin/customermanagement/customers-table";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import StatCardGrid from "@/app/components/Admin/customermanagement/customerStarGrid";
import { customersData } from "./data";
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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>(customersData);
  

  const [filters, setFilters] = useState<{
    outstandingRange?: string;
  }>({});

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;

    setCustomers((prev) => prev.filter((c) => c.id !== selectedCustomer.id));
    setSelectedCustomer(null);
  };

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const filterFields: SelectField[] = [
    {
      name: "outstandingRange",
      placeholder: "Select Outstanding Range",
      options: [
        { label: "Below 50,000", value: "lt50k" },
        { label: "50,000 - 100,000", value: "50k-100k" },
        { label: "Above 100,000", value: "gt100k" },
      ],
    },
  ];

  const filteredCustomers = useTableFilters<Customer>({
    data: customersData as Customer[],
    search,
    start,
    end,
    searchKeys: ["id", "name", "email", "promoCard"],
    filters,
  }).filter((c) => {
    if (!filters.outstandingRange) return true;

    if (filters.outstandingRange === "lt50k" && c.outstanding >= 50000)
      return false;
    if (
      filters.outstandingRange === "50k-100k" &&
      (c.outstanding < 50000 || c.outstanding > 100000)
    )
      return false;
    if (filters.outstandingRange === "gt100k" && c.outstanding <= 100000)
      return false;

    return true;
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
          <FilterChips
            filters={filters}
            onRemove={handleRemoveFilter}
          />

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
        <CustomerActionsBar
          selectedCustomer={selectedCustomer}
          onDelete={handleDeleteCustomer}
        />

        <CustomersTable
          customers={filteredCustomers}
          selectedCustomer={selectedCustomer}
          setSelectedCustomer={setSelectedCustomer}
        />
      </div>
    </DashboardLayout>
  );
}
