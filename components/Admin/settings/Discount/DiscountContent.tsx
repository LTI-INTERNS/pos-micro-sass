"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import DiscountTable from "@/components/Admin/settings/Discount/DiscountTable";
import AddDiscountPopup from "@/components/Admin/settings/Discount/AddDiscountPopup";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import DeactivateDiscountPopup from "@/components/Admin/settings/Discount/DeactivateDiscountPopup";
import { useTableFilters } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import LoadingState from "@/components/Admin/common/LoadingState";

// THE FIX: Import the Toast System
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

import { Discount } from "@/types/discount";
import { discountService } from "@/lib/services/discountService";

export default function DiscountContent() {
  const { data: session } = useSession();
  
  const token = (session as any)?.user?.backendToken;

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  // THE FIX: Initialize the toast hook
  const { toasts, showToast, dismissToast } = useToast();

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  const [filters, setFilters] = useState<{ status?: string; branch?: string }>({});
  const filterLabels: Record<string, string> = {
    active: "Active",
    expired: "Expired",
  };

  const userRole = session?.user?.role?.toUpperCase() || "";
  const isAdminOrOwner = userRole === "ADMIN" || userRole === "OWNER";

  const branchOptions = useMemo(() => {
    if (!isAdminOrOwner) return [];
    const branches = Array.from(new Set(discounts.map(d => d.branch?.name).filter(Boolean)));
    return branches.sort().map(name => ({ label: name!, value: name! }));
  }, [discounts, isAdminOrOwner]);

  const fetchDiscounts = useCallback(async (isInitial = false) => {
    if (!token) return;
    try {
      if (isInitial) setLoading(true);
      const data = await discountService.getDiscounts(token);
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDiscounts(true);
    const interval = setInterval(() => fetchDiscounts(), 10000);
    return () => clearInterval(interval);
  }, [fetchDiscounts]);

  const handleSaveDiscount = async (values: any) => {
    try {
      await discountService.createDiscount({
        title: values.title,
        percentage: Number(values.percentage),
        startDate: values.startDate,
        endDate: values.endDate,
        branchIds: values.branchIds, 
      }, token);
      await fetchDiscounts();
      showToast("Discount added successfully!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to add discount.", "error");
      throw error; // THE FIX: Re-throw to prevent the AddDiscountPopup from closing
    }
  };

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return;
    try {
      await discountService.deleteDiscount(selectedDiscount.discountId, token);
      setDiscounts((prev) => prev.filter((d) => d.discountId !== selectedDiscount.discountId));
      setSelectedDiscount(null);
      setDeleteOpen(false);
      showToast("Discount deleted successfully!", "success");
    } catch (error: any) {
      showToast(error.message || "Failed to delete discount.", "error");
    }
  };

  const handleToggleStatus = async () => {
    if (!selectedDiscount) return;
    try {
      const newStatus = !selectedDiscount.status;
      setDiscounts((prev) => 
        prev.map((d) => d.discountId === selectedDiscount.discountId ? { ...d, status: newStatus } : d)
      );
      
      await discountService.toggleStatus(selectedDiscount.discountId, newStatus, token);
      setDeactivateOpen(false);
      
      await fetchDiscounts();
      showToast(`Discount ${newStatus ? "activated" : "deactivated"} successfully!`, "success");
    } catch (error: any) {
      showToast(error.message || "Failed to update discount status.", "error");
      await fetchDiscounts();
    }
  };

  const baseFilteredDiscounts = useTableFilters<Discount>({
    data: discounts,
    search,
    start,
    end,
    dateKey: "startDate", 
    searchKeys: ["discountId", "title"],
    filters: {},
  });

  const filteredDiscounts = baseFilteredDiscounts.filter((d) => {
    if (filters.status) {
      const expired = new Date(d.endDate) < new Date();
      if (filters.status === "active" && (expired || !d.status)) return false;
      if (filters.status === "expired" && (!expired && d.status)) return false;
    }

    if (isAdminOrOwner && filters.branch && d.branch?.name !== filters.branch) {
      return false;
    }

    return true;
  });

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  if (loading) return <LoadingState message="Loading discounts..." />;

  return (
    <div className="w-full space-y-5">
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
      />

      <div className="relative">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Discounts..."
          debounceMs={300}
          showFilter
          filterLabel="Filter"
          onFilter={() => setShowFilter(true)}
          isFilterApplied={isFilterApplied}
          onClearFilters={() => setFilters({})}
        />

        <FilterChips
          filters={{
            ...filters,
            status: filters.status ? filterLabels[filters.status] : "",
            branch: filters.branch || "",
          }}
          onRemove={removeFilter}
        />

        <FilterPopup
          open={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={(values) => {
            setFilters(values);
            setShowFilter(false);
          }}
          fields={[
            {
              name: "status",
              placeholder: "Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Expired", value: "expired" },
              ],
            },
            ...(isAdminOrOwner ? [
              {
                name: "branch",
                placeholder: "Branch",
                options: branchOptions,
              },
            ] : []),
          ]}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <ActionButton
          label="Activate / Deactivate Discount"
          variant="outline"
          disabled={!selectedDiscount}
          onClick={() => setDeactivateOpen(true)}
        />
        <ActionButton
          label="Delete Discount"
          variant="outline"
          disabled={!selectedDiscount}
          onClick={() => setDeleteOpen(true)}
        />
        <ActionButton
          label="Add Discount"
          variant="primary"
          onClick={() => setShowAddDiscount(true)}
        />
      </div>

      <DiscountTable
        discounts={filteredDiscounts}
        selectedRowId={selectedDiscount?.id}
        onSelectRow={(row) => setSelectedDiscount(row)}
      />

      <AddDiscountPopup
        open={showAddDiscount}
        onClose={() => setShowAddDiscount(false)}
        onSave={handleSaveDiscount}
      />

      <DeactivateDiscountPopup
        isOpen={deactivateOpen}
        onClose={() => setDeactivateOpen(false)}
        discount={selectedDiscount ?? undefined}
        onConfirm={handleToggleStatus}
      />

      {selectedDiscount && (
        <DeletePopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          item={selectedDiscount}
          itemName="Discount"
          getDisplayText={(d) => (
            <>
              Title - {d.title}
              <br />
              Percentage - {d.percentage}%
              <br />
              Branch - {d.branch?.name || "All"}
            </>
          )}
          onConfirm={handleDeleteDiscount}
        />
      )}

      {/* THE FIX: Render ToastNotification at the bottom */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}