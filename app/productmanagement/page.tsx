"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/app/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import ProductActionsBar from "@/app/components/Admin/productmanagement/product-actions";
import FilterPopup from "@/app/components/Admin/common/FilterPopup";
import ProductsTable from "@/app/components/Admin/productmanagement/product-table";
import { productsData } from "./data";
import { useTableFilters, getFilterOptions } from "@/app/components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";

type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
  tax: number;
  stock: number;
};

export default function ProductsPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<{
    tax?: string;
    stock?: string;
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


  const taxOptions = getFilterOptions(productsData, "tax");
  const stockOptions = getFilterOptions(productsData, "stock");

  const filteredProducts = useTableFilters<Product>({
    data: productsData as Product[],
    search,
    start,
    end,
    searchKeys: ["id", "name", "price"],
    filters,
  });

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />

        <StatCardGrid />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Products..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={[
              { name: "tax", placeholder: "Tax", options: taxOptions },
              { name: "stock", placeholder: "Stock", options: stockOptions },
            ]}
          />
        </div>
        <FilterChips filters={filters} onRemove={handleRemoveFilter} />
        <ProductActionsBar />
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
