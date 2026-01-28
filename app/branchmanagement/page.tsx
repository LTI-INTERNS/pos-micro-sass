"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";

import BranchActionsBar from "@/app/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/app/components/Admin/branchmanagement/branches-table";
import  StatCardGrid from "@/app/components/Admin/branchmanagement/branchStarCardGrid";
import { filterRows } from "./filterRows";
import { branchesData } from "./data";

export default function BranchesPage() {
  const [query, setQuery] = useState("");

  const filteredBranches = useMemo(() => {
    return filterRows(branchesData, query, ["id", "name", "phone", "address"]);
  }, [query]);

  return (
    <DashboardLayout>

      <div className="w-full space-y-6">

        
          <DateRangePicker />
          <StatCardGrid />
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

        <BranchActionsBar />
       
        <BranchesTable branches={filteredBranches} />

      </div>
    </DashboardLayout>
  );
}
