"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/app/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/app/components/Admin/customermanagement/customers-table";
import StatCardGrid from "@/app/components/Admin/customermanagement/customerStarGrid";
import { filterRows } from "./filterRows";
import { customersData } from "./data";

export default function CustomersPage() {
  const [query, setQuery] = useState("");

  const filteredCustomers = useMemo(() => {
    return filterRows(customersData, query, ["name", "phone", "email", "promoCard"]);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
       <DateRangePicker />
       <StatCardGrid />

        {/* Toolbar (Search + Actions) */}
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

        {/* Table */}
        <CustomersTable customers={filteredCustomers} />
      </div>
    </DashboardLayout>
  );
}
