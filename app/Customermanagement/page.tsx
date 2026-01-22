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
    return filterRows(customersData, query, [
      "name",
      "phone",
      "email",
      "promoCard",
    ]);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Stats */}
        <StatCardGrid />

        {/* Search + Table */}
        <div className="space-y-4">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search customers..."
          />
          <CustomerActionsBar />
          <CustomersTable customers={filteredCustomers} />
        </div>

        
      </div>
    </DashboardLayout>
  );
}
