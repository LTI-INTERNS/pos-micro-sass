"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import BranchActionsBar from "@/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { branchService, Branch } from "@/lib/services/branch-service";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";

export default function BranchesPage() {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [start] = useState<Date | undefined>();
  const [end] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Fetch all branches on mount
  useEffect(() => {
    branchService.getAll().then(setAllBranches).catch(err => console.error("Failed to fetch branches", err));
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

  // --- NEW: Handle Adding Branch ---
  // Inside your BranchesPage component:

  const handleAddBranch = async (values: Record<string, string>) => {
    try {
      const payload = {
        name: values.name,
        city: values.city,
        phone: values.phoneNumber,
        address: values.address,
        registrationNumber: values.registrationNumber,
        email: values.email,
        password: values.password, 
      };
      
      const newBranch = await branchService.create(payload as any);
      setAllBranches((prev) => [...prev, newBranch]);
    } catch (error: any) {
      // THE FIX: Pull the exact message from our backend!
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to add branch. Please check the network.");
      }
    }
  };

  const handleEditBranch = async (updatedBranch: Branch) => {
    if (!selectedBranch) return;
    try {
      const payload: any = {
        name: updatedBranch.name,
        city: updatedBranch.city,
        phone: updatedBranch.phone,
        address: updatedBranch.address,
        registrationNumber: updatedBranch.regno, 
        email: updatedBranch.email,
      };

      if ((updatedBranch as any).password) {
        payload.password = (updatedBranch as any).password;
      }

      const updated = await branchService.update(selectedBranch.id, payload);
      setAllBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setSelectedBranch(updated);
    } catch (error: any) {
      // THE FIX: Pull the exact message from our backend!
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Failed to update branch.");
      }
    }
  };

  // --- NEW: Handle Deleting Branch ---
  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    try {
      await branchService.delete(selectedBranch.id);
      setAllBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
      setSelectedBranch(null);
    } catch (error) {
      console.error("Failed to delete branch", error);
      alert("Failed to delete branch. It may be linked to existing records.");
    }
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
          onAdd={handleAddBranch}
          onEdit={handleEditBranch}
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