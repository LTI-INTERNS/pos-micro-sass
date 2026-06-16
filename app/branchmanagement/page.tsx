"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import SearchBar from "@/components/Admin/common/Search-bar";
import BranchActionsBar from "@/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { branchService, Branch } from "@/lib/services/branch-service";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";

import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

export default function BranchesPage() {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [start] = useState<Date | undefined>();
  const [end] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const { toasts, showToast, dismissToast } = useToast();

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

  const handleAddBranch = async (values: Record<string, string>) => {
    // THE FIX: Added "throw new Error()" to stop the popup from closing!
    if (allBranches.some(b => b.phone === values.phoneNumber)) {
      showToast("Phone number is already registered", "error");
      throw new Error("Validation Error");
    }
    if (allBranches.some(b => b.email === values.email)) {
      showToast("Email is already registered", "error");
      throw new Error("Validation Error");
    }
    
    if (values.registrationNumber && values.registrationNumber.trim() !== "") {
      if (allBranches.some(b => b.regno === values.registrationNumber)) {
        showToast("Registration number is already registered", "error");
        throw new Error("Validation Error");
      }
    }

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
      showToast("Branch added successfully!", "success");
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error, "Failed to add branch. Please check the network."), "error");
      throw error; // THE FIX: Pass the error back to the popup so it stays open
    }
  };

  const handleEditBranch = async (updatedBranch: Branch) => {
    if (!selectedBranch) return;

    // THE FIX: Added "throw new Error()" to stop the popup from closing!
    if (allBranches.some(b => b.id !== selectedBranch.id && b.phone === updatedBranch.phone)) {
      showToast("Phone number is already registered", "error");
      throw new Error("Validation Error");
    }
    if (allBranches.some(b => b.id !== selectedBranch.id && b.email === updatedBranch.email)) {
      showToast("Email is already registered", "error");
      throw new Error("Validation Error");
    }

    if (updatedBranch.regno && updatedBranch.regno.trim() !== "") {
      if (allBranches.some(b => b.id !== selectedBranch.id && b.regno === updatedBranch.regno)) {
        showToast("Registration number is already registered", "error");
        throw new Error("Validation Error");
      }
    }

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
      showToast("Branch updated successfully!", "success");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Failed to update branch.", "error");
      }
      throw error; // THE FIX: Pass the error back to the popup so it stays open
    }
  };

  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    try {
      await branchService.delete(selectedBranch.id);
      setAllBranches((prev) => prev.filter((b) => b.id !== selectedBranch.id));
      setSelectedBranch(null);
      showToast("Branch deleted successfully!", "success");
    } catch (error) {
      console.error("Failed to delete branch", error);
      showToast("Failed to delete branch. It may be linked to existing records.", "error");
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <StatCardGrid branches={allBranches} />

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
          showToast={showToast} // THE FIX: Pass the showToast function
        />

        <BranchesTable
          branches={filteredBranches}
          selectedBranch={selectedBranch}
          setSelectedBranch={setSelectedBranch}
        />
      </div>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}