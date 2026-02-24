"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import BranchActionsBar from "@/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { branchService, Branch } from "@/lib/services";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useEffect } from "react";

export default function BranchesPage() {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [start] = useState<Date | undefined>();
  const [end] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  useEffect(() => {
    branchService.getAll().then(setAllBranches);
  }, []);

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

  const nameOptions = getFilterOptions(allBranches, "name");
  const addressOptions = getFilterOptions(allBranches, "address");

  const filteredBranches = useTableFilters<Branch>({
    data: allBranches as Branch[],
    search,
    start,
    end,
    searchKeys: ["id", "name", "address", "regno", "email"],
    filters,
  });

  const handleDeleteBranch = () => {
    if (!selectedBranch) return;
    setAllBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
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
