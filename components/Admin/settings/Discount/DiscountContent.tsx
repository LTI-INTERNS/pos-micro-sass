"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import DiscountTable from "@/components/Admin/settings/Discount/DiscountTable";
import AddDiscountPopup from "@/components/Admin/settings/Discount/AddDiscountPopup";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import { useTableFilters } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";

import { Discount } from "@/types/discount";
import { discountService } from "@/lib/services/discountService";

export default function DiscountContent() {
  const { data: session } = useSession();
  
  // THE FIX: Extracting the token exactly like PersonalContent.tsx
  const token = (session as any)?.user?.backendToken;

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null);

  const [filters, setFilters] = useState<{ status?: string }>({});
  const filterLabels: Record<string, string> = {
    active: "Active",
    expired: "Expired",
  };

  const fetchDiscounts = useCallback(async () => {
    if (!token) return; // Don't fetch if token isn't loaded yet
    try {
      setLoading(true);
      const data = await discountService.getDiscounts(token);
      setDiscounts(data);
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleSaveDiscount = async (values: any) => {
    await discountService.createDiscount({
      title: values.title,
      percentage: Number(values.percentage),
      startDate: values.startDate,
      endDate: values.endDate,
      branchId: values.branchId,
    }, token);
    await fetchDiscounts();
  };

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return;
    try {
      await discountService.deleteDiscount(selectedDiscount.discountId, token);
      setSelectedDiscount(null);
      setDeleteOpen(false);
      await fetchDiscounts();
    } catch (error) {
      console.error("Error deleting discount:", error);
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
    if (!filters.status) return true;

    const expired = new Date(d.endDate) < new Date();
    if (filters.status === "active") return !expired && d.status;
    if (filters.status === "expired") return expired || !d.status;

    return true;
  });

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  if (loading) return <div className="p-4 text-sm text-gray-500">Loading discounts...</div>;

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
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
}