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
import AddProductPopup from "@/app/components/Admin/productmanagement/AddProductPopup";
import AddStockPopup from "@/app/components/Admin/productmanagement/addStockPopup";
import DeletePopup from "@/app/components/Admin/common/Deletepopup";
import EditEntityModal from "@/app/components/Admin/common/EditPopup";

import { productsData } from "./data";
import type { Product } from "./data";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>(productsData);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [filters, setFilters] = useState<{
    category?: string;
    discount?: string;
    tax?: string;
    stock?: string;
    lowstock?: string;
  }>({});

  const filteredProducts = useTableFilters({
    data: products,
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
      <div className="w-full space-y-6">
        <DateRangePicker />
        <StatCardGrid />

        <div className="relative w-full">
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
              setFilterOpen(false); 
            }}
            fields={[
            { name: "category", placeholder: "Category", options: getFilterOptions(products, "category") },
            { name: "discount", placeholder: "Discount", options: getFilterOptions(products, "discount") },
            { name: "tax", placeholder: "Tax", options: getFilterOptions(products, "tax") },
            { name: "stock", placeholder: "Stock", options: getFilterOptions(products, "stock") },
            { name: "lowstock", placeholder: "Low Stock", options: getFilterOptions(products, "lowstock") },
          ]}
          />
        </div>

        <ProductActionsBar
          selectedProduct={selectedProduct}
          onAddStock={() => setAddStockOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          onEdit={() => setEditOpen(true)}
          onAddNew={() => setAddOpen(true)}
        />

        <ProductsTable
          products={filteredProducts}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
        />
      </div>

      {/* ADD */}
      <AddProductPopup
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(newProduct) => {
          // Backend will handle creation later
          setAddOpen(false);
        }}
        userRole="admin"       // TODO: replace with real role from auth session
        branchName=""          // TODO: replace with real branch from auth session
        branchManager=""       // TODO: replace with real manager from auth session
      />

      {/* EDIT */}
      <EditEntityModal<Product>
        open={editOpen}
        title="Edit Product"
        initialValues={selectedProduct}
        onClose={() => setEditOpen(false)}
        onSave={(updated) => {
          // Backend will handle update later
          setEditOpen(false);
        }}
        fields={[
          { name: "name", label: "Product Name" },
          { name: "price", label: "Price", type: "number" },
          { name: "discount", label: "Discount" },
          { name: "tax", label: "Tax" },
          { name: "stock", label: "Stock", type: "number" },
        ]}
      />

      {/* ADD STOCK */}
      {selectedProduct && (
        <AddStockPopup
          product={selectedProduct}
          isOpen={addStockOpen}
          onClose={() => setAddStockOpen(false)}
          onSave={(qty) => {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === selectedProduct.id
                  ? { ...p, stock: p.stock + qty }
                  : p
              )
            );
            setAddStockOpen(false);
          }}
        />
      )}

      {/* DELETE */}
      {selectedProduct && (
        <DeletePopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          item={selectedProduct}
          itemName="Product"
          getDisplayText={(p) => (
            <>
              ID - {p.id}<br />
              Name - {p.name}<br />
              Category - {p.category}
            </>
          )}
          onConfirm={() => {
            setProducts((prev) =>
              prev.filter((p) => p.id !== selectedProduct.id)
            );
            setSelectedProduct(null);
            setDeleteOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}