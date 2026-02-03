"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import SearchBar from "@/app/components/Admin/common/Search-bar";

import BranchActionsBar from "@/app/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/app/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/app/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import { filterRows } from "./filterRows";
import { branchesData } from "./data";

type Branch = {
  id: number;
  name: string;
  phone: string;
  address: string;
  regno: number;
  email: string;
  password: string;
};

export default function BranchesPage() {
  const [query, setQuery] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    name: "",
    address: "",
  });

  const filterFields: SelectField[] = useMemo(() => {
    const uniqueNames = Array.from(new Set(branchesData.map((b: Branch) => b.name))).filter(Boolean);
    const uniqueAddresses = Array.from(new Set(branchesData.map((b: Branch) => b.address))).filter(Boolean);

    return [
      {
        name: "name",
        placeholder: "Select Branch Name",
        options: uniqueNames.map((n) => ({ label: n, value: n })),
      },
      {
        name: "address",
        placeholder: "Select Address",
        options: uniqueAddresses.map((a) => ({ label: a, value: a })),
      },
    ];
  }, [branchesData]);

  const filteredBranches = useMemo(() => {
    const searched = filterRows<Branch>(branchesData as Branch[], query, [
      "id",
      "name",
      "phone",
      "address",
    ]);

    return searched.filter((b) => {
      if (filters.name && b.name !== filters.name) return false;
      if (filters.address && b.address !== filters.address) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <StatCardGrid />

        <div className="relative w-full">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search branches..."
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

        <BranchActionsBar />
        <BranchesTable branches={filteredBranches} />
      </div>
    </DashboardLayout>
  );
}
