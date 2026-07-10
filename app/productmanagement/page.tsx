"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
import { BusinessTypeId } from "@/components/Admin/productmanagement/Productcategorydata";
import { useLowStockNotifications } from "@/components/Admin/notifications/Uselowstocknotifications";
import { useNegativeStockAlerts } from "@/components/Admin/notifications/useNegativeStockAlerts";

// THE FIX: Import the Global Toast System
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

import { productService, Product } from "@/lib/services";
import { useUrlFilters } from "@/hooks/useUrlFilters";
import { useStoreInfo } from "@/lib/context/StoreInfoContext";
import LoadingState from "@/components/Admin/common/LoadingState";
import { getApiErrorMessage, getApiErrorCode } from "@/lib/utils/api-error";
import { orderService } from "@/lib/services/order-service";

interface VariantLike {
  variantId?: string | number;
  id?: string | number;
  sku: string;
  sellUnit?: string;
}

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
      ...(v as unknown as Record<string, unknown>), 
      id: i + 1,
      sku: v.sku,
      barcode: v.barcode || "",
      imageUrl: v.imageUrl || "",
      basePrice: String(v.price),
      sellingPrice: String(v.price),
      sellUnit: "Each",
      optionValues: v.optionValues ?? [],
    })),
  };
}

type TaggedProduct = Product & { _selectedVariantSku?: string };

function getBaseProduct(p: Product): Product {
  const copy = { ...p } as TaggedProduct;
  delete copy._selectedVariantSku;
  return copy as Product;
}

type UserRole = "owner" | "admin" | "manager";

const managerAvailabilityOptions = [
  { label: "Available", value: "Available" },
  { label: "Unavailable", value: "Unavailable" },
];

const managerStockOptions = [
  { label: "Low Stock", value: "Low Stock" },
  { label: "Out of Stock", value: "Out of Stock" },
  { label: "In Stock", value: "In Stock" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const { storeInfo } = useStoreInfo();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // THE FIX: Initialize the toast hook
  const { toasts, showToast, dismissToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOrderCount, setDeleteOrderCount] = useState(0);

  const { filters: urlFilters, setFilter } = useUrlFilters();

  const search = urlFilters.search || "";
  const setSearch = useCallback((val: string) => setFilter("search", val), [setFilter]);
  const filterOpen = !!urlFilters.filterOpen;
  const setFilterOpen = (val: boolean) => setFilter("filterOpen", val ? "true" : null);

  const role = session?.user?.role?.toLowerCase();
  const userRole: UserRole =
    role === "owner" || role === "admin" || role === "manager"
      ? (role as UserRole)
      : "manager";

  const canUseBranchFilter = userRole === "admin" || userRole === "owner";
  const activeBranchId = canUseBranchFilter ? "" : (session?.user?.branchId ?? "");

  const activeBranchLabel = session?.user?.branchName || "";

  const sessionStatus = status;
  const sessionCompanyId = session?.user?.companyId ?? "";

  const lastSyncProductRef = useRef<Product | null>(null);

  const reloadProducts = useCallback(async () => {
    const refreshed = await productService.getAll(activeBranchId ? { branchId: activeBranchId } : undefined);
    setProducts(refreshed);
  }, [activeBranchId]);

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
    if (sessionStatus !== "authenticated" || !sessionCompanyId) return;

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
  }, [sessionStatus, sessionCompanyId, activeBranchId]);
  
  useEffect(() => {
    if (selectedProduct) {
      const updated = products.find(p => p.id === selectedProduct.id);
      if (updated && updated !== lastSyncProductRef.current) {
        lastSyncProductRef.current = updated;
        const tag = (selectedProduct as TaggedProduct)._selectedVariantSku;
        if (tag) {
          setSelectedProduct({ ...updated, _selectedVariantSku: tag } as Product);
        } else {
          setSelectedProduct(updated);
        }
      }
    } else {
      lastSyncProductRef.current = null;
    }
  }, [products, selectedProduct]);

  useEffect(() => {
    if (sessionStatus !== "authenticated") return;

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        reloadProducts();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [sessionStatus, reloadProducts]);

  useEffect(() => {
    if (!addVariantOpen) return;
    setCatalogLoading(true);
    productService.getCatalog()
      .then(setCatalogProducts)
      .finally(() => setCatalogLoading(false));
  }, [addVariantOpen]);

  const filters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { search: _search, filterOpen: _filterOpen, ...rest } = urlFilters;
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
    allBarcodes: string;
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

        if (stockQty <= 0) return "Out of Stock";
        if (stockQty <= lowStock) return "Low Stock";
        return "In Stock";
      });

      let stockStatus = "Out of Stock";
      if (variantStatuses.includes("Out of Stock")) {
        stockStatus = "Out of Stock";
      } else if (variantStatuses.includes("Low Stock")) {
        stockStatus = "Low Stock";
      } else if (variantStatuses.includes("In Stock")) {
        stockStatus = "In Stock";
      }

      const stockedBranchNames = Object.keys(
        (p as Product & { branchesStock?: Record<string, unknown> }).branchesStock ?? {}
      );

      return {
        ...p,
        numberOfVariants: String(variantsCount),
        availability: availabilityStatus,
        lowStockStatus: stockStatus,
        branch: activeBranchLabel || stockedBranchNames[0] || "All Branches",
        allBarcodes: variants.map(v => typeof v === "object" && v !== null && "barcode" in v ? String(v.barcode) : "").filter(Boolean).join(" "),
      };
    });
  }, [products, activeBranchLabel]);

  const branchFilterOptions = useMemo(
    () =>
      Array.from(
        new Set(
          products.flatMap((product) =>
            Object.keys(
              (product as Product & { branchesStock?: Record<string, unknown> }).branchesStock ?? {}
            )
          )
        )
      ).map((branch) => ({ label: branch, value: branch })),
    [products]
  );

  const selectedBranch = filters.branch?.trim() || "";

  const branchFilteredProducts = useMemo(() => {
    if (!canUseBranchFilter || !selectedBranch) {
      return enrichedProducts;
    }

    return enrichedProducts.filter((product) => {
      const branchesStock = (product as Product & { branchesStock?: Record<string, unknown> }).branchesStock;
      return Boolean(branchesStock && Object.prototype.hasOwnProperty.call(branchesStock, selectedBranch));
    });
  }, [canUseBranchFilter, enrichedProducts, selectedBranch]);

  const barcodeBuffer = useRef("");
  const scanTimeout = useRef<NodeJS.Timeout | null>(null);
  const setSearchRef = useRef(setSearch);

  useEffect(() => {
    setSearchRef.current = setSearch;
  }, [setSearch]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!e.key) return;

      if (e.key === "Enter") {
        if (barcodeBuffer.current.length > 0) {
          setSearchRef.current(barcodeBuffer.current);
          barcodeBuffer.current = "";
          if (scanTimeout.current) clearTimeout(scanTimeout.current);
        }
        return;
      }

      if (e.key.length === 1) {
        barcodeBuffer.current += e.key;

        if (scanTimeout.current) clearTimeout(scanTimeout.current);
        scanTimeout.current = setTimeout(() => {
          barcodeBuffer.current = "";
        }, 200); 
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (scanTimeout.current) clearTimeout(scanTimeout.current);
    };
  }, []);

  const tableFilters = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { branch: _branch, ...rest } = filters;
    return rest;
  }, [filters]);

  const displayFilters = useMemo(() => {
    const visible: Record<string, string> = {};

    Object.entries(urlFilters).forEach(([key, value]) => {
      if (key === "search" || key === "filterOpen") return;
      if (!value) return;
      visible[key] = value;
    });

    return visible;
  }, [urlFilters]);

  const isFilterApplied = Object.entries(urlFilters).some(
    ([key, value]) =>
      key !== "search" &&
      key !== "filterOpen" &&
      value &&
      String(value).trim() !== ""
  );

  const filteredProducts = useTableFilters({
    data: branchFilteredProducts,
    search,
    start,
    end,
    dateKey: userRole === "manager" ? undefined : "createdAt",
    searchKeys: ["id", "name", "category", "allBarcodes"],
    filters:
      userRole === "manager"
        ? (() => {
          const {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            availability: _availability,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            lowStockStatus: _lowStockStatus,
            ...rest
          } = tableFilters;
          return rest;
        })()
        : tableFilters,
  });

  const filterFields = useMemo(() => {
    return canUseBranchFilter ? [
      { name: "branch", placeholder: "Branch", options: branchFilterOptions },
      { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
      { name: "numberOfVariants", placeholder: "Number of Variants", options: getFilterOptions(enrichedProducts, "numberOfVariants") },
    ] : [
      { name: "category", placeholder: "Category", options: getFilterOptions(enrichedProducts, "category") },
      { name: "availability", placeholder: "Availability", options: managerAvailabilityOptions },
      { name: "lowStockStatus", placeholder: "Stock", options: managerStockOptions },
    ];
  }, [canUseBranchFilter, branchFilterOptions, enrichedProducts]);

  const managerVariantFilteredProducts = useMemo(() => {
    if (userRole !== "manager") {
      return filteredProducts as Product[];
    }

    const availabilityFilter = filters.availability?.trim();
    const stockFilter = filters.lowStockStatus?.trim();
    const hasDateRange = Boolean(start && end);

    return (filteredProducts as Product[])
      .map((product) => {
        const matchingVariants = (product.variants ?? []).filter((variant) => {
          const availabilityStatus = (variant.available ?? true)
            ? "Available"
            : "Unavailable";

          if (hasDateRange) {
            const createdRaw = variant.branchVariantCreatedAt ?? variant.createdAt ?? product.createdAt;
            if (!createdRaw) return false;
            const createdDate = new Date(createdRaw);
            if (Number.isNaN(createdDate.getTime())) return false;
            if (createdDate < (start as Date) || createdDate > (end as Date)) return false;
          }

          const stockQty = Number(variant.stockQty ?? 0);
          const lowStock = Number(variant.lowStock ?? 0);
          const variantStockStatus =
            stockQty <= 0
              ? "Out of Stock"
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
    setFilters({ lowStockStatus: "Out of Stock" });
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

  const removeFilter = (key: string) => {
    setFilter(key, null);
  };

  const handleFilterApply = (newFilters: Record<string, string | null>) => {
    setFilters(newFilters);
  };

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

  const handleDeleteClick = async () => {
    if (!baseSelectedProduct) {
      showToast("Please select a product first!", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      const params = activeBranchId ? { branchId: activeBranchId } : undefined;
      const allOrders = await orderService.getAll(params);
      const productOrders = allOrders.filter((order) =>
        order.items.some((item) => {
          const trimmedName = item.name.trim();
          const targetName = baseSelectedProduct.name.trim();
          return trimmedName === targetName || trimmedName.startsWith(targetName + " – ");
        })
      );
      setDeleteOrderCount(productOrders.length);
      setDeleteOpen(true);
    } catch (err) {
      console.error("Failed to check product relations:", err);
      setDeleteOrderCount(0);
      setDeleteOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const baseSelectedProduct = useMemo(() => 
    selectedProduct ? getBaseProduct(selectedProduct) : null
  , [selectedProduct]);

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

  useEffect(() => {
    const handleRefresh = () => reloadProducts();
    window.addEventListener("product-data-refresh", handleRefresh);
    return () => window.removeEventListener("product-data-refresh", handleRefresh);
  }, [reloadProducts]);

  const editInitialData = useMemo(() => {
    if (!editOpen || !baseSelectedProduct) return null;
    return {
      id: baseSelectedProduct.id,
      name: baseSelectedProduct.name,
      categoryId: baseSelectedProduct.categoryId || baseSelectedProduct.category,
      brand: baseSelectedProduct.brand || "",
      description: baseSelectedProduct.description || "",
      options: (baseSelectedProduct.options ?? []).map((opt, i) => {
        const parsedId = Number(opt.id);
        return {
          id: Number.isNaN(parsedId) ? i + 1 : parsedId,
          name: opt.name,
          values: opt.values,
        };
      }),
      variants: (baseSelectedProduct.variants ?? []).map((v, i) => ({
        id: i + 1,
        sku: v.sku,
        barcode: v.barcode || "",
        imageUrl: v.imageUrl || "",
        basePrice: String(v.price),
        sellingPrice: String(v.price),
        sellUnit: "Each",
        optionValues: v.optionValues ?? [],
      })),
    };
  }, [editOpen, baseSelectedProduct]);

  const companyProductData: ExistingProduct | null = null;

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">

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
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />

        <div className="relative w-full">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
            debounceMs={300}
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
            onApply={handleFilterApply}
            closeOnApply={false}
            fields={filterFields}
          />
        </div>

        <ProductActionsBar
          selectedProduct={baseSelectedProduct}
          onAddStock={() => setAddStockOpen(true)}
          onDelete={handleDeleteClick}
          onEdit={() => setEditOpen(true)}
          onAddNew={() => setAddOpen(true)}
          userRole={userRole}
          onAddVariant={() => setAddVariantOpen(true)}
          showToast={showToast} // THE FIX: Pass showToast down
          deleteLoading={deleteLoading}
        />

        {isLoading ? (
          <LoadingState message="Loading products..." className="py-24" />
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

      <AddProductPopup
        open={productPopupOpen}
        onClose={handleProductPopupClose}
        showToast={showToast} // THE FIX: Pass showToast down
        onSave={async (updatedProduct) => {
          try {
            if (editOpen && baseSelectedProduct) {
              await productService.update(baseSelectedProduct.id, updatedProduct as never);
              await reloadProducts();
              showToast("Product updated successfully!", "success");
            } else {
              await productService.create(updatedProduct as never);
              await reloadProducts();
              showToast("Product created successfully!", "success");
            }
            // THE FIX: Close modal ONLY if save was successful
            handleProductPopupClose();
          } catch (error: unknown) {
            console.error("Failed to save product:", error);
            const code = getApiErrorCode(error);
            if (code === "SKU_ALREADY_EXISTS") {
              showToast("Already existing SKU", "error");
            } else {
              const msg = getApiErrorMessage(error, "Failed to save product.");
              showToast(`Error: ${msg}`, "error");
            }
            // Do NOT call handleProductPopupClose() here, so data stays intact
          }
        }}
        onAddToBranch={async (selectedCatalogProducts) => {
          try {
            const { apiClient } = await import("@/lib/api-client");
            for (const p of selectedCatalogProducts) {
              const variants = (p.variants ?? []).map((v: VariantLike) => ({
                variantId: v.variantId ?? v.id ?? v.sku,
                stockQty: 0,
                stockUnit: v.sellUnit || "Each",
                lowStock: 0,
              }));
              if (variants.length === 0) continue;
              await apiClient.post("/branch-variants/stock", { variants });
            }
            await reloadProducts();
            showToast("Products added to branch successfully!", "success");
            // THE FIX: Close modal ONLY if save was successful
            handleProductPopupClose();
          } catch (error: unknown) {
            console.error("Failed to add products to branch:", error);
            const msg = getApiErrorMessage(error, "Failed to add products to branch.");
            showToast(`Error: ${msg}`, "error");
            // Do NOT call handleProductPopupClose() here
          }
        }}
        isAddVariantMode={addVariantOpen}
        existingProducts={existingProductsForVariant}
        initialData={editInitialData}
        companyProduct={companyProductData}
        userRole={userRole}
        businessTypeId={storeInfo.businessTypeId as BusinessTypeId}
        catalogLoading={catalogLoading}
      />

      <ViewProductPopup
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        product={selectedProduct}
        userRole={userRole}
      />

      {baseSelectedProduct && (
        <AddStockPopup
          product={baseSelectedProduct}
          isOpen={addStockOpen}
          onClose={() => setAddStockOpen(false)}
          userRole={userRole}
          branchName={activeBranchLabel || "Selected Branch"}
          branchId={activeBranchId || undefined}
          showToast={showToast} // THE FIX: Pass showToast down
          onSave={async () => {
            await reloadProducts();
          }}
        />
      )}

      {baseSelectedProduct && (
        <DeleteProductPopup
          isOpen={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          product={baseSelectedProduct}
          showToast={showToast} // THE FIX: Pass showToast down
          orderCount={deleteOrderCount}
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
              window.dispatchEvent(new CustomEvent("product-data-refresh"));
              showToast("Product deleted successfully!", "success");
            } catch (error: unknown) {
              console.error("Failed to delete product:", error);
              showToast("Failed to delete product.", "error");
            } finally {
              setDeleteOpen(false);
            }
          }}
        />
      )}
      
      {/* THE FIX: Render global toast container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}