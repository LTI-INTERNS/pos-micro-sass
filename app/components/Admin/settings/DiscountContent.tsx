"use client";

import { useState } from "react";
import DateRangePicker from "../common/DateRangeBar";
import SearchBar from "../common/Search-bar";
import FilterPopup from "../common/FilterPopup";
import ActionButton from "../common/ActionButton";
import DiscountTable, { Discount } from "./DiscountTable";
import AddDiscountPopup from "./AddDiscountPopup";
import DeletePopup from "@/app/components/Admin/common/Deletepopup";
import { mockDiscounts } from "./mock";
import { useTableFilters, getFilterOptions } from "../common/Filterlogic";
import FilterChips from "../common/FilterChips";

export default function DiscountContent() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddDiscount, setShowAddDiscount] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] =
    useState<Discount | null>(null);

  const [filters, setFilters] = useState<{ branch?: string }>({});

  const branchOptions = getFilterOptions(mockDiscounts, "branch");

  const filteredDiscounts = useTableFilters<Discount>({
    data: mockDiscounts,
    search,
    start,
    end,
    dateKey: "createdDate",
    searchKeys: ["id", "title", "branch"],
    filters,
  });

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

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

        <FilterChips filters={filters} onRemove={removeFilter} />

        <FilterPopup
          open={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={(values) => {
            setFilters(values);
            setShowFilter(false);
          }}
          fields={[
            {
              name: "branch",
              placeholder: "Branch",
              options: branchOptions,
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
        onSave={(values) => {
          console.log("Add Discount:", values);
          setShowAddDiscount(false);
        }}
      />

      {selectedDiscount && (
        <DeletePopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          item={selectedDiscount}
          itemName="Discount"
          getDisplayText={(d) => (
            <>
              ID - {d.id}
              <br />
              Title - {d.title}
              <br />
              Percentage - {d.percentage}%
            </>
          )}
          onConfirm={() => {
            console.log("Delete Discount:", selectedDiscount); // DB later
            setSelectedDiscount(null);
            setDeleteOpen(false);
          }}
        />
      )}
    </div>
  );
}
