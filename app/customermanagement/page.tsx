"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import CustomerActionsBar from "@/app/components/Admin/customermanagement/customer-actions";
import CustomersTable from "@/app/components/Admin/customermanagement/customers-table";
//import StatCardGrid from "@/app/Customermanagement/StatCardGrid";
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
       {/*  <StatCardGrid /> */}

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
