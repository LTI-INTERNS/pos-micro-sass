"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import { getApiErrorMessage } from "@/lib/utils/api-error";
import SearchBar from "@/components/Admin/common/Search-bar";
import BranchActionsBar from "@/components/Admin/branchmanagement/branches-actions";
import BranchesTable from "@/components/Admin/branchmanagement/branches-table";
import StatCardGrid from "@/components/Admin/branchmanagement/branchStarCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { branchService, Branch, UpdateBranchInput } from "@/lib/services/branch-service";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { staffService } from "@/lib/services/staff-service";
import { cashierService } from "@/lib/services/cashier-service";
import { orderService } from "@/lib/services/order-service";
import BranchDeleteWarningModal, { BranchDeleteWarnings } from "@/components/Admin/branchmanagement/BranchDeleteWarningModal";

import RefreshButton from "@/components/Admin/common/RefreshButton";
import LoadingState from "@/components/Admin/common/LoadingState";
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

export default function BranchesPage() {
  const [allBranches, setAllBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [start] = useState<Date | undefined>();
  const [end] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  // Delete warning modal state
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteWarnings, setDeleteWarnings] = useState<BranchDeleteWarnings>({
    activeManagerCount: 0,
    activeCashierCount: 0,
    orderCount: 0,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { toasts, showToast, dismissToast } = useToast();

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    try {
      const branches = await branchService.getAll();
      setAllBranches(branches);
    } catch (err) {
      console.error("Failed to fetch branches", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBranches();
  }, [fetchBranches]);

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
    searchKeys: ["id", "name", "city", "address", "regno", "email"],
    filters,
  });

  const handleAddBranch = async (values: Record<string, string>) => {
    // THE FIX: Added "throw new Error()" to stop the popup from closing!
    if (allBranches.some(b => b.name.trim().toLowerCase() === values.name.trim().toLowerCase())) {
      showToast("Branch name is already registered", "error");
      throw new Error("Validation Error");
    }
    if (allBranches.some(b => b.address.trim().toLowerCase() === values.address.trim().toLowerCase())) {
      showToast("Branch address is already registered", "error");
      throw new Error("Validation Error");
    }
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
      
      const newBranch = await branchService.create(payload);
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
    if (allBranches.some(b => b.id !== selectedBranch.id && b.name.trim().toLowerCase() === updatedBranch.name.trim().toLowerCase())) {
      showToast("Branch name is already registered", "error");
      throw new Error("Validation Error");
    }
    if (allBranches.some(b => b.id !== selectedBranch.id && b.address.trim().toLowerCase() === updatedBranch.address.trim().toLowerCase())) {
      showToast("Branch address is already registered", "error");
      throw new Error("Validation Error");
    }
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
      const payload: UpdateBranchInput = {
        name: updatedBranch.name,
        city: updatedBranch.city,
        phone: updatedBranch.phone,
        address: updatedBranch.address,
        registrationNumber: updatedBranch.regno, 
        email: updatedBranch.email,
      };

      if (updatedBranch.password) {
        payload.password = updatedBranch.password;
      }

      const updated = await branchService.update(selectedBranch.id, payload);
      setAllBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      setSelectedBranch(updated);
      showToast("Branch updated successfully!", "success");
    } catch (error: unknown) {
      showToast(getApiErrorMessage(error, "Failed to update branch."), "error");
      throw error; // keeps the modal open
    }
  };

  // Step 1 — pre-check linked records and open warning modal
  const handleDeleteBranch = async () => {
    if (!selectedBranch) return;
    setDeleteLoading(true);
    try {
      const [staffDir, allCashiers, branchOrders] = await Promise.all([
        staffService.getAll(),
        cashierService.getAll(),
        orderService.getAll({ branchId: selectedBranch.id }),
      ]);

      const activeManagers = staffDir.managers.filter(
        (m) => m.branchId === selectedBranch.id && m.activeStatus
      );
      const activeCashiers = allCashiers.filter(
        (c) => c.branchId === selectedBranch.id && c.activeStatus
      );

      setDeleteWarnings({
        activeManagerCount: activeManagers.length,
        activeCashierCount: activeCashiers.length,
        orderCount: branchOrders.length,
      });
      setDeleteWarningOpen(true);
    } catch {
      // If pre-check fails, still allow deletion with zero counts
      setDeleteWarnings({ activeManagerCount: 0, activeCashierCount: 0, orderCount: 0 });
      setDeleteWarningOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Step 2 — user confirmed in the warning modal, actually delete
  const handleConfirmDelete = async () => {
    if (!selectedBranch) return;
    setDeleteWarningOpen(false);
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
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
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

            <RefreshButton
              onClick={() => { void fetchBranches(); }}
              loading={loading}
              title="Refresh branches"
            />
          </div>
        </div>

        <BranchActionsBar
          selectedBranch={selectedBranch}
          onAdd={handleAddBranch}
          onEdit={handleEditBranch}
          onDelete={handleDeleteBranch}
          deleteLoading={deleteLoading}
          showToast={showToast}
        />

        {loading ? (
          <LoadingState message="Loading branches..." className="py-24" />
        ) : (
          <BranchesTable
            branches={filteredBranches}
            selectedBranch={selectedBranch}
            setSelectedBranch={setSelectedBranch}
          />
        )}
      </div>

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />

      {/* Branch delete warning modal */}
      {selectedBranch && (
        <BranchDeleteWarningModal
          isOpen={deleteWarningOpen}
          branchName={selectedBranch.name}
          warnings={deleteWarnings}
          onClose={() => setDeleteWarningOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </DashboardLayout>
  );
}