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

import { branchService, productService, Branch, Product } from "@/lib/services";
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

function formatBranchLabel(branch: Branch) {
  return branch.city?.trim() ? `${branch.name} (${branch.city})` : branch.name;
}

type UserRole = "owner" | "admin" | "manager";

const managerAvailabilityOptions = [
  { label: "Available", value: "Available" },
  { label: "Unavailable", value: "Unavailable" },
];

const managerStockOptions = [
  { label: "Low Stock", value: "Low Stock" },
  { label: "No Stock", value: "No Stock" },
  { label: "In Stock", value: "In Stock" },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const { storeInfo } = useStoreInfo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // ── ALL hooks must be declared before any conditional return ─────────────────

  const [products, setProducts] = useState<Product[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
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

  const canUseBranchFilter = userRole === "admin" || userRole === "owner";
  const activeBranchId = canUseBranchFilter
    ? (urlFilters.branch || "")
    : (session?.user?.branchId ?? "");

  const branchLookup = useMemo(() => {
    return new Map(branches.map((branch) => [branch.id, formatBranchLabel(branch)]));
  }, [branches]);

  const activeBranchLabel = useMemo(() => {
    if (activeBranchId) {
      return branchLookup.get(activeBranchId) || session?.user?.branchName || "";
    }
    return session?.user?.branchName || "";
  }, [activeBranchId, branchLookup, session?.user?.branchName]);

  const branchOptions = useMemo(
    () => branches.map((branch) => ({ label: formatBranchLabel(branch), value: branch.id })),
    [branches]
  );

  useEffect(() => {
    setSelectedProduct(null);
    setViewOpen(false);
    setEditOpen(false);
    setAddOpen(false);
    setAddVariantOpen(false);
    setAddStockOpen(false);
    setDeleteOpen(false);
  }, [activeBranchId]);

  useEffect(() => {
    if (!session) return;
    branchService.getAll().then(setBranches);
  }, [session]);

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    setIsLoading(true);
    productService
      .getAll(activeBranchId ? { branchId: activeBranchId } : undefined)
      .then((data) => {
        if (!cancelled) {
          setProducts(data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [session, activeBranchId]);

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
    const { search: _search, filterOpen: _filterOpen, branch: _branch, ...rest } = urlFilters;
    return rest;
  }, [urlFilters]);

  const setFilters = (newFilters: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("filterOpen");

    Object.entries(urlFilters).forEach(([key]) => {
      if (key !== "search" && key !== "filterOpen") {
        params.delete(key);
      }
    });

    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
      else params.delete(k);
    });

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const notificationBranchId = 1;
  const notificationBranchName = activeBranchLabel || "Selected Branch";

  useLowStockNotifications({ products, branchId: notificationBranchId, branchName: notificationBranchName, branchManager: "Nimal Perera" });
  useNegativeStockAlerts({ products, branchId: notificationBranchId, branchName: notificationBranchName, branchManager: "Nimal Perera" });

  type EnrichedProduct = Product & {
    numberOfVariants: string;
    availability: string;
    lowStockStatus: string;
    branch: string;
  };

  const enrichedProducts: EnrichedProduct[] = useMemo(() => {
    return products.map(p => {
      const variantsCount = p.variants?.length || 0;
      const variants = p.variants ?? [];

      const hasAvailableVariant = variants.some((variant) => Boolean(variant.available ?? true));
      const availabilityStatus = hasAvailableVariant ? "Available" : "Unavailable";

      const variantStatuses = variants.map((variant) => {
        const stockQty = Number(variant.stockQty ?? 0);
        const lowStock = Number(variant.lowStock ?? 0);

        if (stockQty <= 0) return "No Stock";
        if (stockQty <= lowStock) return "Low Stock";
        return "In Stock";
      });

      let stockStatus = "No Stock";
      if (variantStatuses.includes("No Stock")) {
        stockStatus = "No Stock";
      } else if (variantStatuses.includes("Low Stock")) {
        stockStatus = "Low Stock";
      } else if (variantStatuses.includes("In Stock")) {
        stockStatus = "In Stock";
      }

      return {
        ...p,
        numberOfVariants: String(variantsCount),
        availability: availabilityStatus,
        lowStockStatus: stockStatus,
        branch: activeBranchLabel || "All Branches",
      };
    });
  }, [products, activeBranchLabel]);

  const displayFilters = useMemo(() => {
    const visible: Record<string, string> = {};

    Object.entries(urlFilters).forEach(([key, value]) => {
      if (key === "search" || key === "filterOpen") return;
      if (!value) return;
      visible[key] = key === "branch" ? (branchLookup.get(value) || value) : value;
    });

    return visible;
  }, [branchLookup, urlFilters]);

  const isFilterApplied = Object.entries(urlFilters).some(
    ([key, value]) =>
      key !== "search" &&
      key !== "filterOpen" &&
      value &&
      String(value).trim() !== ""
  );

  const filteredProducts = useTableFilters({
    data: enrichedProducts,
    search,
    start,
    end,
    dateKey: userRole === "manager" ? undefined : "createdAt",
    searchKeys: ["id", "name", "category"],
    filters:
      userRole === "manager"
        ? (() => {
            const {
              availability: _availability,
              lowStockStatus: _lowStockStatus,
              ...rest
            } = filters;
            return rest;
          })()
        : filters,
  });

  const managerVariantFilteredProducts = useMemo(() => {
    if (userRole !== "manager") {
      return filteredProducts as Product[];
    }

    const availabilityFilter = filters.availability?.trim();
    const stockFilter = filters.lowStockStatus?.trim();
    const hasDateRange = Boolean(start && end);

    if (!availabilityFilter && !stockFilter) {
      return filteredProducts as Product[];
    }

    return (filteredProducts as Product[])
      .map((product) => {
        const matchingVariants = (product.variants ?? []).filter((variant) => {
          const availabilityStatus = (variant.available ?? true)
            ? "Available"
            : "Unavailable";

          if (hasDateRange) {
            const createdRaw = variant.branchVariantCreatedAt ?? variant.createdAt;
            if (!createdRaw) return false;
            const createdDate = new Date(createdRaw);
            if (Number.isNaN(createdDate.getTime())) return false;
            if (createdDate < (start as Date) || createdDate > (end as Date)) return false;
          }

          const stockQty = Number(variant.stockQty ?? 0);
          const lowStock = Number(variant.lowStock ?? 0);
          const variantStockStatus =
            stockQty <= 0
              ? "No Stock"
              : stockQty <= lowStock
              ? "Low Stock"
              : "In Stock";

          if (availabilityFilter && availabilityStatus !== availabilityFilter) {
            return false;
          }
          if (stockFilter && variantStockStatus !== stockFilter) {
            return false;
          }

          return true;
        });

        return { ...product, variants: matchingVariants };
      })
      .filter((product) => (product.variants?.length ?? 0) > 0);
  }, [filteredProducts, filters.availability, filters.lowStockStatus, userRole, start, end]);

  const managerStats = useMemo(() => {
    const allProductsCount = products.length;
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    let productVariantsCount = 0;
    let lowStockVariantCount = 0;
    let outOfStockVariantCount = 0;
    let currentWindowVariantCount = 0;
    let previousWindowVariantCount = 0;

    const currentWindowProductCount = products.filter((product) => {
      if (!product.createdAt) return false;
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= thirtyDaysAgo;
    }).length;

    const previousWindowProductCount = products.filter((product) => {
      if (!product.createdAt) return false;
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
    }).length;

    products.forEach((product) => {
      (product.variants ?? []).forEach((variant) => {
        productVariantsCount += 1;

        const variantCreatedAtRaw = variant.createdAt ?? product.createdAt;
        if (variantCreatedAtRaw) {
          const variantCreatedAt = new Date(variantCreatedAtRaw);
          if (!Number.isNaN(variantCreatedAt.getTime())) {
            if (variantCreatedAt >= thirtyDaysAgo) {
              currentWindowVariantCount += 1;
            } else if (variantCreatedAt >= sixtyDaysAgo) {
              previousWindowVariantCount += 1;
            }
          }
        }

        const stockQty = Number(variant.stockQty ?? 0);
        const lowStock = Number(variant.lowStock ?? 0);
        const isLowStock = stockQty > 0 && stockQty <= lowStock;
        const isOutOfStock = stockQty <= 0;

        if (isLowStock) {
          lowStockVariantCount += 1;
        }
        if (isOutOfStock) {
          outOfStockVariantCount += 1;
        }
      });
    });

    const lowStockVariantPercentage =
      productVariantsCount > 0
        ? `${((lowStockVariantCount / productVariantsCount) * 100).toFixed(1)}%`
        : "0.0%";
    const outOfStockVariantPercentage =
      productVariantsCount > 0
        ? `${((outOfStockVariantCount / productVariantsCount) * 100).toFixed(1)}%`
        : "0.0%";

    const allProductsTrend: "up" | "down" =
      currentWindowProductCount >= previousWindowProductCount ? "up" : "down";
    const allProductsPercentage =
      previousWindowProductCount > 0
        ? `${(((currentWindowProductCount - previousWindowProductCount) / previousWindowProductCount) * 100).toFixed(1)}%`
        : currentWindowProductCount > 0
        ? "100.0%"
        : "0.0%";

    const productVariantsTrend: "up" | "down" =
      currentWindowVariantCount >= previousWindowVariantCount ? "up" : "down";
    const productVariantsPercentage =
      previousWindowVariantCount > 0
        ? `${(((currentWindowVariantCount - previousWindowVariantCount) / previousWindowVariantCount) * 100).toFixed(1)}%`
        : currentWindowVariantCount > 0
        ? "100.0%"
        : "0.0%";

    return {
      allProductsCount,
      productVariantsCount,
      lowStockVariantCount,
      outOfStockVariantCount,
      allProductsTrend,
      allProductsPercentage,
      productVariantsTrend,
      productVariantsPercentage,
      lowStockVariantPercentage,
      outOfStockVariantPercentage,
    };
  }, [products]);

  const handleLowStockCardClick = () => {
    if (userRole !== "manager") return;
    setFilters({ lowStockStatus: "Low Stock" });
  };

  const handleOutOfStockCardClick = () => {
    if (userRole !== "manager") return;
    setFilters({ lowStockStatus: "No Stock" });
  };

  const handleAllVariantsCardClick = () => {
    if (userRole !== "manager") return;
    setFilters({ availability: null, lowStockStatus: null });
  };

  const ownerAdminStats = useMemo(() => {
    const categoriesCount = new Set(
      products
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category))
    ).size;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newProductsCount = products.filter((product) => {
      if (!product.createdAt) return false;
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= thirtyDaysAgo;
    }).length;

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const currentWindowCategoriesCount = new Set(
      products
        .filter((product) => {
          if (!product.createdAt) return false;
          const createdAt = new Date(product.createdAt);
          if (Number.isNaN(createdAt.getTime())) return false;
          return createdAt >= thirtyDaysAgo;
        })
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category))
    ).size;

    const previousWindowCategoriesCount = new Set(
      products
        .filter((product) => {
          if (!product.createdAt) return false;
          const createdAt = new Date(product.createdAt);
          if (Number.isNaN(createdAt.getTime())) return false;
          return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
        })
        .map((product) => product.category?.trim())
        .filter((category): category is string => Boolean(category))
    ).size;

    const previousNewProductsCount = products.filter((product) => {
      if (!product.createdAt) return false;
      const createdAt = new Date(product.createdAt);
      if (Number.isNaN(createdAt.getTime())) return false;
      return createdAt >= sixtyDaysAgo && createdAt < thirtyDaysAgo;
    }).length;

    const newProductsTrend: "up" | "down" =
      newProductsCount >= previousNewProductsCount ? "up" : "down";

    const categoriesTrend: "up" | "down" =
      currentWindowCategoriesCount >= previousWindowCategoriesCount
        ? "up"
        : "down";

    const categoriesPercentage =
      previousWindowCategoriesCount > 0
        ? `${(((currentWindowCategoriesCount - previousWindowCategoriesCount) / previousWindowCategoriesCount) * 100).toFixed(1)}%`
        : currentWindowCategoriesCount > 0
        ? "100.0%"
        : "0.0%";

    const newProductsPercentage =
      previousNewProductsCount > 0
        ? `${(((newProductsCount - previousNewProductsCount) / previousNewProductsCount) * 100).toFixed(1)}%`
        : newProductsCount > 0
        ? "100.0%"
        : "0.0%";

    return {
      categoriesCount,
      categoriesTrend,
      categoriesPercentage,
      newProductsCount,
      newProductsTrend,
      newProductsPercentage,
    };
  }, [products]);

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

  const handleVariantAvailabilityChange = (
    productId: string,
    sku: string,
    available: boolean
  ) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id !== productId) return product;
        return {
          ...product,
          variants: (product.variants ?? []).map((variant) =>
            variant.sku === sku ? { ...variant, available } : variant
          ),
        };
      })
    );

    setSelectedProduct((prev) => {
      if (!prev || prev.id !== productId) return prev;
      return {
        ...prev,
        variants: (prev.variants ?? []).map((variant) =>
          variant.sku === sku ? { ...variant, available } : variant
        ),
      };
    });
  };

  const reloadProducts = async () => {
    const refreshed = await productService.getAll(activeBranchId ? { branchId: activeBranchId } : undefined);
    setProducts(refreshed);
  };

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
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />
        <StatCardGrid
          userRole={userRole}
          allProductsCount={managerStats.allProductsCount}
          productVariantsCount={managerStats.productVariantsCount}
          allProductsTrend={managerStats.allProductsTrend}
          allProductsPercentage={managerStats.allProductsPercentage}
          productVariantsTrend={managerStats.productVariantsTrend}
          productVariantsPercentage={managerStats.productVariantsPercentage}
          onAllVariantsClick={handleAllVariantsCardClick}
          lowStockVariantCount={managerStats.lowStockVariantCount}
          outOfStockVariantCount={managerStats.outOfStockVariantCount}
          lowStockVariantPercentage={managerStats.lowStockVariantPercentage}
          outOfStockVariantPercentage={managerStats.outOfStockVariantPercentage}
          onLowStockClick={handleLowStockCardClick}
          onOutOfStockClick={handleOutOfStockCardClick}
          categoriesCount={ownerAdminStats.categoriesCount}
          categoriesTrend={ownerAdminStats.categoriesTrend}
          categoriesPercentage={ownerAdminStats.categoriesPercentage}
          newProductsCount={ownerAdminStats.newProductsCount}
          newProductsTrend={ownerAdminStats.newProductsTrend}
          newProductsPercentage={ownerAdminStats.newProductsPercentage}
        />

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
          <FilterChips filters={displayFilters} onRemove={removeFilter} />
          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onApply={setFilters}
            closeOnApply={false}
            fields={
              canUseBranchFilter ? [
                { name: "branch", placeholder: "Branch", options: branchOptions },
                { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
                { name: "numberOfVariants", placeholder: "Number of Variants", options: getFilterOptions(enrichedProducts, "numberOfVariants") },
              ] : [
                { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
                { name: "availability", placeholder: "Availability", options: managerAvailabilityOptions },
                { name: "lowStockStatus", placeholder: "Stock", options: managerStockOptions },
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
            products={managerVariantFilteredProducts as Product[]}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            onToggleAvailability={handleVariantAvailabilityChange}
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
              await reloadProducts();
            } else {
              console.log("CREATING PRODUCT PAYLOAD:", JSON.stringify(updatedProduct, null, 2));
              await productService.create(updatedProduct as never);
              await reloadProducts();
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
            await reloadProducts();
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
          branchName={activeBranchLabel || "Selected Branch"}
          onSave={async () => {
            // Re-fetch branch-scoped products so table reflects new stock immediately
            await reloadProducts();
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