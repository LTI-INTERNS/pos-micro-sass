"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/dashboard_layout";

import SearchBar from "@/app/components/Dashboard/common/Search-bar";
import CashierActionsBar from "@/app/components/product-actions";
import ProductsTable from "@/app/components/product-table";
import SupplierPopup from "@/app/components/SupplyPopUp/Supplier-popup";

import { filterRows } from "@/app/components/Dashboard/common/filterRows";
import { productsData } from "@/app/ProductManager/data";

export default function DashboardPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    return filterRows(productsData, query, ["id", "name", "price","discount"]);
  }, [query]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        {/* Toolbar */}
        <section className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <SupplierPopup />
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search products..."
            showFilter
            filterLabel="Filter"
            onFilter={() => console.log("open filter popup")}
          />

          <CashierActionsBar />
        </section>

        {/* Table */}
        <ProductsTable products={filteredProducts} />
      </div>
    </DashboardLayout>
  );
}
