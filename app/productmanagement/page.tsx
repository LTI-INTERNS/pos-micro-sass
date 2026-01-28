"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/app/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import ProductActionsBar from "@/app/components/Admin/productmanagement/product-actions";
import ProductsTable from "@/app/components/Admin/productmanagement/product-table";
import { filterRows } from "./filterRows";
import { productsData } from "./data";

export default function DashboardPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return filterRows(productsData, query, ["id", "name", "price","discount"]);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Toolbar */}
       
          <DateRangePicker />
          <StatCardGrid />
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search products..."
            showFilter
            filterLabel="Filter"
            onFilter={() => console.log("open filter popup")}
          />

          <ProductActionsBar />
       

        {/* Table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
