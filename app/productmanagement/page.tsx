"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
import { useStoreInfo } from "@/lib/context/StoreInfoContext";

// ── Shared local interfaces ───────────────────────────────────────────────────

interface VariantLike {
  variantId?: string | number;
  id?: string | number;
  sku: string;
  sellUnit?: string;
}

interface ApiError {
  message?: string;
  response?: {
    data?: {
      message?: string;
      error?: { message?: string };
    };
  };
}

// ── Helper: map a Product to the ExistingProduct / initialData shape ──────────

function toPopupProduct(p: Product) {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    categoryId: p.categoryId,
    brand: p.brand || "",
    description: p.description || "",
    options: (p.options ?? []).map((opt, i) => ({
      id: i + 1,
      name: opt.name,
      values: opt.values,
    })),
    variants: (p.variants ?? []).map((v, i) => ({
      ...(v as unknown as Record<string, unknown>), // preserves real variantId from the backend spread
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

type TaggedProduct = Product & { _selectedVariantSku?: string };

function getBaseProduct(p: Product): Product {
  const copy = { ...p } as TaggedProduct;
  delete copy._selectedVariantSku;
  return copy as Product;
}

type UserRole = "owner" | "admin" | "manager";

export default function DashboardPage() {
  const { data: session } = useSession();
  const { storeInfo } = useStoreInfo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── ALL hooks must be declared before any conditional return ─────────────────

  const [products, setProducts] = useState<Product[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [addVariantOpen, setAddVariantOpen] = useState(false);
  const [addStockOpen, setAddStockOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { filters: urlFilters, setFilter } = useUrlFilters();

  const search = urlFilters.search || "";
  const setSearch = (val: string) => setFilter("search", val);
  const filterOpen = !!urlFilters.filterOpen;
  const setFilterOpen = (val: boolean) => setFilter("filterOpen", val ? "true" : null);

  const role = session?.user?.role?.toLowerCase();
  const userRole: UserRole =
    role === "owner" || role === "admin" || role === "manager"
      ? (role as UserRole)
      : "manager";

  useEffect(() => {
    productService.getAll()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  // Fetch full company catalog when the "Add from Catalog" popup opens.
  // Uses ?catalog=true to bypass the branch filter so managers see everything.
  useEffect(() => {
    if (!addVariantOpen) return;
    setCatalogLoading(true);
    productService.getCatalog()
      .then(setCatalogProducts)
      .finally(() => setCatalogLoading(false));
  }, [addVariantOpen]);

  // Exclude UI state from actual data filters
  const filters = useMemo(() => {
    const { search: _search, filterOpen: _filterOpen, ...rest } = urlFilters;
    return rest;
  }, [urlFilters]);

  const setFilters = (newFilters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  useLowStockNotifications({ products, branchId: 1, branchName: "Colombo Branch", branchManager: "Nimal Perera" });
  useNegativeStockAlerts({ products, branchId: 1, branchName: "Colombo Branch", branchManager: "Nimal Perera" });

  type EnrichedProduct = Product & {
    numberOfVariants: string;
    availability: string;
    lowStockStatus: string;
    branch: string;
  };

  const enrichedProducts: EnrichedProduct[] = useMemo(() => {
    return products.map(p => {
      const variantsCount = p.variants?.length || 0;
      return {
        ...p,
        numberOfVariants: String(variantsCount),
        availability: "Available",   // Mocked
        lowStockStatus: "No",        // Mocked
        branch: "All Branches",      // Mocked
      };
    });
  }, [products]);

  const filteredProducts = useTableFilters({
    data: enrichedProducts,
    search,
    searchKeys: ["id", "name", "category"],
    filters,
  });

  const isFilterApplied = Object.values(filters).some((v) => v && String(v).trim() !== "");
  const removeFilter = (key: string) => setFilter(key, null);

  // Build catalog list for the manager "Add from Company Catalog" popup.
  // - Catalog source: ALL company products (from getCatalog, bypasses branch filter)
  // - Mark products already stocked in this branch as alreadyAdded:true
  const branchProductIds = useMemo(
    () => new Set(products.map((p) => p.id)),
    [products]
  );
  const existingProductsForVariant = useMemo(
    () =>
      catalogProducts.map((p) => ({
        ...toPopupProduct(p),
        alreadyAdded: branchProductIds.has(p.id),
      })),
    [catalogProducts, branchProductIds]
  );

  const productPopupOpen = editOpen || addOpen || addVariantOpen;
  const handleProductPopupClose = () => {
    setEditOpen(false);
    setAddOpen(false);
    setAddVariantOpen(false);
  };

  const baseSelectedProduct: Product | null = selectedProduct
    ? getBaseProduct(selectedProduct)
    : null;

  const editInitialData =
    editOpen && baseSelectedProduct
      ? {
          name: baseSelectedProduct.name,
          categoryId: baseSelectedProduct.categoryId || baseSelectedProduct.category,
          brand: baseSelectedProduct.brand || "",
          description: baseSelectedProduct.description || "",
          options: (baseSelectedProduct.options ?? []).map((opt) => ({
            id: opt.id,
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

  const companyProductData: ExistingProduct | null = null;

  // ── Now safe to do conditional rendering in JSX ─────────────────────────────

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
            fields={
              userRole === "admin" || userRole === "owner" ? [
                { name: "branch", placeholder: "Branch", options: getFilterOptions(enrichedProducts, "branch") },
                { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
                { name: "numberOfVariants", placeholder: "Number of Variants", options: getFilterOptions(enrichedProducts, "numberOfVariants") },
              ] : [
                { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
                { name: "availability", placeholder: "Availability", options: getFilterOptions(enrichedProducts, "availability") },
                { name: "lowStockStatus", placeholder: "Low Stock", options: getFilterOptions(enrichedProducts, "lowStockStatus") },
              ]
            }
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
            products={filteredProducts as unknown as Product[]}
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
        onSave={async (updatedProduct) => {
          // This fires for non-catalog flows (Add New Product, Edit Product)
          try {
            if (editOpen && baseSelectedProduct) {
              console.log("SENDING TO SERVICE:", {
                id: baseSelectedProduct.id,
                payload: updatedProduct,
              });
              await productService.update(baseSelectedProduct.id, updatedProduct as never);
              const refreshed = await productService.getAll();
              setProducts(refreshed);
            } else {
              console.log("CREATING PRODUCT PAYLOAD:", JSON.stringify(updatedProduct, null, 2));
              const created = await productService.create(updatedProduct as never);
              setProducts(prev => [...prev, created as Product]);
            }
          } catch (error: unknown) {
            console.error("Failed to save product:", error);
            const err = error as ApiError;
            const msg =
              err?.response?.data?.error?.message ||
              err?.response?.data?.message ||
              err?.message ||
              "Failed to save product.";
            alert(`Error from Server: ${msg}`);
          }
          handleProductPopupClose();
        }}
        onAddToBranch={async (selectedCatalogProducts) => {
          // Catalog mode: register each selected product's variants in this branch
          // by calling /branch-variants/stock with stockQty:0.
          // This creates the BranchVariant rows so the product appears in manager's table.
          try {
            const { apiClient } = await import("@/lib/api-client");
            for (const p of selectedCatalogProducts) {
              const variants = (p.variants ?? []).map((v: VariantLike) => ({
                variantId: v.variantId ?? v.id ?? v.sku,
                stockQty:  0,
                stockUnit: v.sellUnit || "Each",
                lowStock:  0,
              }));
              if (variants.length === 0) continue;
              await apiClient.post("/branch-variants/stock", { variants });
            }
            // Refresh branch product list
            const refreshed = await productService.getAll();
            setProducts(refreshed);
          } catch (error: unknown) {
            console.error("Failed to add products to branch:", error);
            const err = error as ApiError;
            const msg =
              err?.response?.data?.message ||
              err?.message ||
              "Failed to add products to branch.";
            alert(`Error: ${msg}`);
          }
          handleProductPopupClose();
        }}
        isAddVariantMode={addVariantOpen}
        existingProducts={existingProductsForVariant}
        initialData={editInitialData}
        companyProduct={companyProductData}
        userRole={userRole}
        businessTypeId={storeInfo.businessTypeId as any}
        catalogLoading={catalogLoading}
      />

      {/* ViewProductPopup */}
      <ViewProductPopup
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
        userRole={userRole}
      />

      {/* AddStockPopup */}
      {baseSelectedProduct && (
        <AddStockPopup
          product={baseSelectedProduct}
          isOpen={addStockOpen}
          onClose={() => setAddStockOpen(false)}
          userRole={userRole}
          branchName="Colombo Branch"
          onSave={async () => {
            // Re-fetch branch-scoped products so table reflects new stock immediately
            const refreshed = await productService.getAll();
            setProducts(refreshed);
            setAddStockOpen(false);
          }}
        />
      )}

      {/* DeleteProductPopup */}
      {baseSelectedProduct && (
        <DeleteProductPopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          product={baseSelectedProduct}
          onConfirm={async ({ deleteAll, selectedVariants }) => {
            try {
              if (deleteAll) {
                await productService.delete(baseSelectedProduct.id);
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
            } catch (error: unknown) {
              console.error("Failed to delete product:", error);
              alert("Failed to delete product.");
            } finally {
              setDeleteOpen(false);
            }
          }}
        />
      )}
    </DashboardLayout>
  );
}