"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import BranchActionsBar from "@/app/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/app/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/app/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup from "@/app/components/Admin/common/FilterPopup";
import { branchesData } from "./data";
import { useTableFilters, getFilterOptions } from "@/app/components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";

type Branch = {
  id: string;
  name: string;
  phone: string;
  address: string;
  regno: number;
  email: string;
  password: string;
};

export default function BranchesPage() {
  const [start] = useState<Date | undefined>();
  const [end] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [filters, setFilters] = useState<{
    name?: string;
    address?: string;
  }>({});

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  const nameOptions = getFilterOptions(branchesData, "name");
  const addressOptions = getFilterOptions(branchesData, "address");

  const filteredBranches = useTableFilters<Branch>({
    data: branchesData as Branch[],
    search,
    start,
    end,
    searchKeys: ["id", "name", "address", "regno", "email"],
    filters,
  });

  const handleDeleteBranch = () => {
    if (!selectedBranch) return;
    const index = branchesData.findIndex((b) => b.id === selectedBranch.id);
    if (index >= 0) branchesData.splice(index, 1);
    setSelectedBranch(null);
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <StatCardGrid />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search branches..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />
          <FilterChips filters={filters} onRemove={handleRemoveFilter} />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={[
              { name: "name", placeholder: "Branch Name", options: nameOptions },
              { name: "address", placeholder: "Address", options: addressOptions },
            ]}
          />
        </div>
        
        <BranchActionsBar
          selectedBranch={selectedBranch}
          onDelete={handleDeleteBranch}
        />

        <BranchesTable
          branches={filteredBranches}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      </div>
    </DashboardLayout>
  );
}
