"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/dashboard_layout";
import SearchBar from "@/app/components/common/Search-bar";
import BranchActionsBar from "@/app/components/customer-actions";
import BranchesTable from "@/app/components/customers-table";
import StatCardGrid from "@/app/components/StatCardGrid";
import { filterRows } from "@/app/components/common/filterRows";
import {branchesData } from "@/app/Customermanagement/data";

export default function BranchesPage() {
  const [query, setQuery] = useState("");

  const filteredBranches = useMemo(() => {
    return filterRows(branchesData, query, ["id", "name", "phone", "address"]);
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
  placeholder="Search branches..."
  showFilter
  filterLabel="Filter"
  onFilter={() => {
    console.log("open filter popup");
  }}
/>
          <BranchActionsBar
          />
        </section>

        {/* Table */}
        <BranchesTable branches={filteredBranches} />
      </div>
    </DashboardLayout>
  );
}
