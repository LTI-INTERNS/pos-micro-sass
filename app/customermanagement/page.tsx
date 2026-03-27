"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/components/Admin/customermanagement/customers-table";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import StatCardGrid from "@/components/Admin/customermanagement/customerStarGrid";
import { customerService, Customer } from "@/lib/services";
import { useTableFilters } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";

export default function CustomersPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    customerService.getAll().then(setCustomers);
  }, []);

  const [filters, setFilters] = useState<{
    points?: string;
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
      name: "points",
      placeholder: "Select Points Range",
      options: [
        { label: "Below 50", value: "lt50" },
        { label: "50 - 100", value: "50-100" },
        { label: "Above 100", value: "gt100" },
      ],
    },
  ];

  // Use generic filter hook only for search + date
  const baseFilteredCustomers = useTableFilters<Customer>({
    data: customers,
    search,
    start,
    end,
    searchKeys: ["id", "name", "email", "promoCard"],
    filters: {}, // ✅ do not pass points filter here
  });

  // Apply points filter manually
  const filteredCustomers = baseFilteredCustomers.filter((c) => {
    if (!filters.points) return true;

    switch (filters.points) {
      case "lt50":
        return c.points < 50;
      case "50-100":
        return c.points >= 50 && c.points <= 100;
      case "gt100":
        return c.points > 100;
      default:
        return true;
    }
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
              setFilters(values as { points?: string });
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        <CustomerActionsBar
          selectedCustomer={selectedCustomer}
          onDelete={handleDeleteCustomer}
          onEdit={(updatedCustomer) => {
            setCustomers((prev) =>
              prev.map((c) =>
                c.id === updatedCustomer.id ? updatedCustomer : c
              )
            );
            setSelectedCustomer(updatedCustomer);
          }}
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