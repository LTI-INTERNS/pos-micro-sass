"use client";

import { useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/components/Admin/common/Search-bar";
import ProductActionsBar from "@/components/Admin/productmanagement/product-actions";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import ProductsTable from "@/components/Admin/productmanagement/product-table";
import AddProductPopup from "@/components/Admin/productmanagement/AddProductPopup";
import AddStockPopup from "@/components/Admin/productmanagement/addStockPopup";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import ViewProductPopup from "@/components/Admin/productmanagement/ViewProductPopup";
import { useLowStockNotifications } from "@/components/Admin/notifications/Uselowstocknotifications";
import { useNegativeStockAlerts } from "@/components/Admin/notifications/useNegativeStockAlerts";

import { productService, Product } from "@/lib/services";
import { useEffect } from "react";
import { useUrlFilters } from "@/hooks/useUrlFilters";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { filters: urlFilters, setFilter } = useUrlFilters();
  const search = urlFilters.search || "";
  const setSearch = (val: string) => setFilter("search", val);
  const filterOpen = !!urlFilters.filterOpen;
  const setFilterOpen = (val: boolean) => setFilter("filterOpen", val ? "true" : null);

  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filters = urlFilters;
  const setFilters = (newFilters: Record<string, string | null>) => {
    Object.entries(newFilters).forEach(([k, v]) => setFilter(k, v));
  };

  useLowStockNotifications({
    products,
    branchId: 1,
    branchName: "Colombo Branch",
    branchManager: "Nimal Perera",
  });

  useNegativeStockAlerts({
    products,
    branchId: 1,
    branchName: "Colombo Branch",
    branchManager: "Nimal Perera",
  });

  const filteredProducts = useTableFilters({
    data: products,
    search,
    searchKeys: ["id", "name", "category", "supplier"],
    filters,
  });

  const isFilterApplied = Object.values(filters).some(
    (v) => v && String(v).trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilter(key, null);
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
          <FilterChips filters={filters} onRemove={removeFilter} />

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

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading products...</div>
        ) : (
          <ProductsTable
            products={filteredProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onView={(product) => {
              setSelectedProduct(product);
              setViewOpen(true);
            }}
          />
        )}
      </div>

      <AddProductPopup
        open={editOpen || addOpen}
        onClose={() => {
          setEditOpen(false);
          setAddOpen(false);
        }}
        onSave={(updatedProduct) => {
          console.log("UPDATED:", updatedProduct);
          setEditOpen(false);
          setAddOpen(false);
        }}
        initialData={
          editOpen && selectedProduct
            ? {
                name: selectedProduct.name,
                categoryId: selectedProduct.category,
                brand: "",
                supplierId: selectedProduct.supplier,
                description: selectedProduct.description || "",
                options: (selectedProduct.options ?? []).map((opt) => ({
                  id: Math.random(),
                  name: opt.name,
                  values: opt.values,
                })),
                variants: (selectedProduct.variants ?? []).map((v, i) => ({
                  id: i + 1,
                  sku: v.sku,
                  barcode: "",
                  imageUrl: v.imageUrl || "",
                  basePrice: String(v.price),
                  sellingPrice: String(v.price),
                  sellUnit: "Each",
                  optionValues: v.optionValues ?? [],
                })),
              }
            : null
        }
        userRole="manager"
        businessTypeId="bt-002"
      />

      <ViewProductPopup
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
      />

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
            setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id));
            setSelectedProduct(null);
            setDeleteOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}