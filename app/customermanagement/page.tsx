"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/app/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/app/components/Admin/customermanagement/customers-table";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import StatCardGrid from "@/app/components/Admin/customermanagement/customerStarGrid";
import { filterRows } from "./filterRows";
import { customersData } from "./data";

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
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    promoCard: "",
  });

  const filterFields: SelectField[] = useMemo(() => {
    const uniqueNames = Array.from(new Set(customersData.map((c: Customer) => c.name))).filter(Boolean);
    const uniquePromoCards = Array.from(new Set(customersData.map((c: Customer) => c.promoCard))).filter(Boolean);

    return [
      {
        name: "name",
        placeholder: "Select Customer Name",
        options: uniqueNames.map((n) => ({ label: n, value: n })),
      },
      {
        name: "promoCard",
        placeholder: "Select Promo Card",
        options: uniquePromoCards.map((p) => ({ label: p, value: p })),
      },
    ];
  }, []);

  //  Search + popup filtering together
  const filteredCustomers = useMemo(() => {
    const searched = filterRows<Customer>(customersData as Customer[], query, [
      "name",
      "phone",
      "email",
      "promoCard",
    ]);

    return searched.filter((c) => {
      if (filters.name && c.name !== filters.name) return false;
      if (filters.promoCard && c.promoCard !== filters.promoCard) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangePicker />
        <StatCardGrid />

        <div className="relative w-full">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search customers..."
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
          />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => {
              setFilters(values);
              setFilterOpen(false); 
            }}
          />
        </div>

        <CustomerActionsBar />
        <CustomersTable customers={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
}
