"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/dashboard_layout";
import SearchBar from "@/app/components/common/Search-bar";
import CustomerActionsBar from "@/app/components/customer-actions";
import CustomersTable from "@/app/components/customers-table";
import StatCardGrid from "@/app/components/StatCardGrid";
import { filterRows } from "@/app/components/common/filterRows";
import { customersData } from "@/app/Customermanagement/data";

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    return filterRows(customersData, query, ["name", "phone", "email", "promoCard"]);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
       
        <StatCardGrid />

        {/* Toolbar (Search + Actions) */}
        <section className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <SearchBar
  value={query}
  onChange={setQuery}
  placeholder="Search customers..."
  showFilter
  filterLabel="Filter"
  onFilter={() => {
    console.log("open filter popup");
  }}
/>



          <CustomerActionsBar
          />
        </section>

        {/* Table */}
        <CustomersTable customers={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
}
