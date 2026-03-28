"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/components/Admin/common/Search-bar";
import ProductActionsBar from "@/components/Admin/productmanagement/product-actions";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import ProductsTable from "@/components/Admin/productmanagement/product-table";
import AddProductPopup, { ExistingProduct } from "@/components/Admin/productmanagement/AddProductPopup";
import AddStockPopup from "@/components/Admin/productmanagement/addStockPopup";
import DeleteProductPopup from "@/components/Admin/productmanagement/DeleteProductPopup";
import ViewProductPopup from "@/components/Admin/productmanagement/ViewProductPopup";
import { useLowStockNotifications } from "@/components/Admin/notifications/Uselowstocknotifications";
import { useNegativeStockAlerts } from "@/components/Admin/notifications/useNegativeStockAlerts";

import { productService, Product } from "@/lib/services";
import { useUrlFilters } from "@/hooks/useUrlFilters";

// ── Helper: map a Product to the ExistingProduct / initialData shape ──────────

function toPopupProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    brand: "",
    description: p.description || "",
    options: (p.options ?? []).map((opt, i) => ({
      id: i + 1,
      name: opt.name,
      values: opt.values,
    })),
    variants: (p.variants ?? []).map((v, i) => ({
      id: i + 1,
      sku: v.sku,
      barcode: "",
      imageUrl: v.imageUrl || "",
      basePrice: String(v.price),
      sellingPrice: String(v.price),
      sellUnit: "Each",
      optionValues: v.optionValues ?? [],
    })),
  };
}

// ── Helper: extract the base Product from a (possibly variant-tagged) product ─

function getBaseProduct(p: Product): Product {
  const { _selectedVariantSku, ...rest } = p as any;
  return rest as Product;
}

type UserRole = "owner" | "admin" | "manager";

export default function DashboardPage() {
  const userRole: UserRole = "owner"; // TODO: replace with session-derived role

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
  const [addVariantOpen, setAddVariantOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const filters = urlFilters;
  const setFilters = (newFilters: Record<string, string | null>) => {
    Object.entries(newFilters).forEach(([k, v]) => setFilter(k, v));
  };

  useLowStockNotifications({ products, branchId: 1, branchName: "Colombo Branch", branchManager: "Nimal Perera" });
  useNegativeStockAlerts({ products, branchId: 1, branchName: "Colombo Branch", branchManager: "Nimal Perera" });

  const filteredProducts = useTableFilters({
    data: products,
    search,
    searchKeys: ["id", "name", "category"],
    filters,
  });

  const isFilterApplied = Object.values(filters).some((v) => v && String(v).trim() !== "");
  const removeFilter = (key: string) => setFilter(key, null);

  const existingProductsForVariant = products.map(toPopupProduct);

  const productPopupOpen = editOpen || addOpen || addVariantOpen;
  const handleProductPopupClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setAddVariantOpen(false);
  };

  // ── Base product (strip variant tag) — used for all popups ───────────────────
  // In manager view selectedProduct is tagged with _selectedVariantSku from the
  // clicked variant row. We strip that tag so every popup receives the full
  // Product with ALL its variants intact.
  const baseSelectedProduct: Product | null = selectedProduct
    ? getBaseProduct(selectedProduct)
    : null;

  // ── Build initialData for the edit popup from the FULL base product ──────────
  // Previously this was derived from `selectedProduct` (the tagged variant row),
  // which sometimes caused only a single variant to be visible. Using
  // `baseSelectedProduct` guarantees every variant is included.
  const editInitialData =
    editOpen && baseSelectedProduct
      ? {
          name: baseSelectedProduct.name,
          categoryId: baseSelectedProduct.category,
          brand: "",
          description: baseSelectedProduct.description || "",
          options: (baseSelectedProduct.options ?? []).map((opt, i) => ({
            id: i + 1,
            name: opt.name,
            values: opt.values,
          })),
          variants: (baseSelectedProduct.variants ?? []).map((v, i) => ({
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
      : null;

  // ── companyProduct ────────────────────────────────────────────────────────────
  // Always null for the manager role.
  //
  // When companyProduct is NOT null, AddProductPopup diffs it against
  // initialData to find variants not yet on the branch. Because both objects
  // would come from the same Product record every variant cancels out and the
  // list appears empty.
  //
  // Passing null causes AddProductPopup's useEffect to skip the diff and call
  // setState(initialData) directly, which populates the form with ALL options
  // and variants from the full product.
  //
  // When this page is later extended to support owner/admin roles, replace the
  // null with: `editOpen && baseSelectedProduct ? toPopupProduct(baseSelectedProduct) : null`
  const companyProductData: ExistingProduct | null = null;

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
            onApply={(values) => { setFilters(values); setFilterOpen(false); }}
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
          selectedProduct={baseSelectedProduct}
          onAddStock={() => setAddStockOpen(true)}
          onDelete={() => setDeleteOpen(true)}
          onEdit={() => setEditOpen(true)}
          onAddNew={() => setAddOpen(true)}
          userRole={userRole}
          onAddVariant={() => setAddVariantOpen(true)}
        />

        {isLoading ? (
          <div className="p-8 text-center text-slate-500">Loading products...</div>
        ) : (
          <ProductsTable
            products={filteredProducts}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onView={(product: Product) => {
              setSelectedProduct(product);
              setViewOpen(true);
            }}
            userRole={userRole}
          />
        )}
      </div>

      {/* ── Unified Add / Edit / AddVariant popup ── */}
      <AddProductPopup
        open={productPopupOpen}
        onClose={handleProductPopupClose}
        onSave={(updatedProduct) => {
          console.log("SAVED:", updatedProduct);
          handleProductPopupClose();
        }}
        isAddVariantMode={addVariantOpen}
        existingProducts={existingProductsForVariant}
        initialData={editInitialData}
        companyProduct={companyProductData}
        userRole={userRole}
        businessTypeId="bt-002"
      />

      {/* ViewProductPopup — passes the tagged product so manager sees variant details */}
      <ViewProductPopup
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
        userRole={userRole}
      />

      {/* AddStockPopup — uses base product (no variant tag needed) */}
      {baseSelectedProduct && (
        <AddStockPopup
          product={baseSelectedProduct}
          isOpen={addStockOpen}
          onClose={() => setAddStockOpen(false)}
          userRole={userRole}
          // TODO: replace with session-derived branch name
          branchName="Colombo Branch"
          onSave={(data) => {
            console.log("FULL STOCK DATA:", data);
            setAddStockOpen(false);
          }}
        />
      )}

      {/* DeleteProductPopup — uses base product */}
      {baseSelectedProduct && (
        <DeleteProductPopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          product={baseSelectedProduct}
          onConfirm={({ deleteAll, selectedVariants }) => {
            if (deleteAll) {
              setProducts((prev) => prev.filter((p) => p.id !== baseSelectedProduct.id));
            } else {
              setProducts((prev) =>
                prev.map((p) => {
                  if (p.id !== baseSelectedProduct.id) return p;
                  return {
                    ...p,
                    variants: p.variants.filter((v) => !selectedVariants.includes(v.sku)),
                  };
                })
              );
            }
            setDeleteOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}