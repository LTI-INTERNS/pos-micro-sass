"use client";

import { useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/app/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import ProductActionsBar from "@/app/components/Admin/productmanagement/product-actions";
import FilterPopup from "../components/Admin/common/FilterPopup";
import { useTableFilters, getFilterOptions } from "../components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";
import ProductsTable from "@/app/components/Admin/productmanagement/product-table";
import { productsData } from "./data";
import { useTableFilters, getFilterOptions } from "@/app/components/Admin/common/Filterlogic";
import FilterChips from "@/app/components/Admin/common/FilterChips";


export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);


  const [filters, setFilters] = useState<{
    category?: string;
    discount?: string;
    tax?: string;
    stock?: string;
    lowstock?: string;
  }>({});

  const categoryOptions = getFilterOptions(productsData, "category");
  const discountOptions = getFilterOptions(productsData, "discount");
  const taxOptions = getFilterOptions(productsData, "tax");
  const stockOptions = getFilterOptions(productsData, "stock");
  const lowStockOptions = getFilterOptions(productsData, "lowstock");

  const filteredProducts = useTableFilters({
      data: productsData,
      search,
      searchKeys: ["id", "name", "category", "supplier"],
      filters,
    });

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };



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
            placeholder="Search products..."
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />
          <FilterChips
            filters={filters}
            onRemove={removeFilter}
          />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={[
              {
                name: "category",
                placeholder: "Category",
                options: categoryOptions,
              },
              {
                name: "discount",
                placeholder: "Discount",
                options: discountOptions,
              },
              {
                name: "tax",
                placeholder: "Tax",
                options: taxOptions,
              },
              {
                name: "stock",
                placeholder: "Stock",
                options: stockOptions,
              },
              { 
                name: "lowstock",
                placeholder: "Low Stock/ Availability",
                options: lowStockOptions,
              },
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
