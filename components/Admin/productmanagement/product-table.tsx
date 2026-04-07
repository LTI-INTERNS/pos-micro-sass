"use client";

import { useState } from "react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Product } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { BranchStock, ProductWithBranches } from "@/lib/mocks/productmanagement";
import ToggleSwitch from "@/components/Admin/common/ToggleSwitch";
import { apiClient } from "@/lib/api-client";

type Props = {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  onView: (p: Product) => void;
  onToggleAvailability?: (productId: string, sku: string, available: boolean) => void;
  userRole?: "owner" | "admin" | "manager";
};

// ─── Extra backend fields that may be present on a variant at runtime ─────────
// The Product type only declares the base shape; the API may attach branch-level
// fields when fetching for a manager. This type describes those extras.

type RawVariantExtras = {
  variantId?:           string;
  available?:           boolean;
  basePrice?:           number | string;
  sellingPrice?:        number | string;
  priceOverride?:       number | string | null;
  sellingPriceOverride?: number | string | null;
  stockQty?:            number;
};

// ─── Supplier resolution helper ───────────────────────────────────────────────

function resolveSupplierDisplay(product: Product): string {
  const branchStock: BranchStock | undefined = (product as ProductWithBranches).branchStock;
  if (!branchStock) return product.supplier ?? "—";

  const allSuppliers = new Set<string>();
  for (const branch of Object.values(branchStock)) {
    for (const variantDetail of Object.values(branch)) {
      if (variantDetail.supplier) allSuppliers.add(variantDetail.supplier);
    }
  }
  if (allSuppliers.size === 0) return product.supplier ?? "—";
  if (allSuppliers.size === 1) return [...allSuppliers][0];
  return "Multiple Suppliers";
}

// ─── Flat variant row shape (manager view) ────────────────────────────────────

export type VariantRow = {
  id: string;
  _product: Product;
  _sku: string;
  _variantId: string;
  productName: string;
  variantLabel: string;
  sku: string;
  category: string;
  supplier: string;
  // Base prices from the product variant
  basePrice: number;
  sellingPrice: number;
  // Branch-level overrides (null = not set, use base price)
  priceOverride: number | null;
  sellingPriceOverride: number | null;
  stockQty: number;
  available: boolean;
};

function buildVariantRows(products: Product[]): VariantRow[] {
  const rows: VariantRow[] = [];
  for (const product of products) {
    const branchStock: BranchStock | undefined = (product as ProductWithBranches).branchStock;

    for (const variant of product.variants ?? []) {
      const raw = variant as typeof variant & RawVariantExtras;
      const variantLabel = variant.optionValues?.length
        ? variant.optionValues.map((o: { value: string }) => o.value).join(" · ")
        : variant.sku;

      const branchDetail = branchStock
        ? Object.values(branchStock)
            .flatMap((b) => Object.entries(b))
            .find(([sku]) => sku === variant.sku)?.[1]
        : undefined;

      const available: boolean =
        raw.available ?? branchDetail?.available ?? true;

      // Prices: prefer branch override, fall back to product base price
      const basePrice    = Number(raw.basePrice    ?? raw.price ?? 0);
      const sellingPrice = Number(raw.sellingPrice ?? raw.price ?? 0);
      const priceOverride        = raw.priceOverride        != null ? Number(raw.priceOverride)        : null;
      const sellingPriceOverride = raw.sellingPriceOverride != null ? Number(raw.sellingPriceOverride) : null;

      rows.push({
        id:                   `${product.id}__${variant.sku}`,
        _product:             product,
        _sku:                 variant.sku,
        _variantId:           raw.variantId ?? variant.sku,
        productName:          product.name,
        variantLabel,
        sku:                  variant.sku,
        category:             product.category ?? "",
        supplier:             product.supplier ?? "",
        basePrice,
        sellingPrice,
        priceOverride,
        sellingPriceOverride,
        stockQty:             raw.stockQty ?? 0,
        available,
      });
    }
  }
  return rows;
}

// ─── Typed helpers ────────────────────────────────────────────────────────────

const VariantTable = CommonTable as <T extends { id?: string | number }>(
  props: React.ComponentProps<typeof CommonTable<T>>
) => React.ReactElement;

const ProductTable = CommonTable as <T extends { id?: string | number }>(
  props: React.ComponentProps<typeof CommonTable<T>>
) => React.ReactElement;

// ─── Availability toggle state shape ─────────────────────────────────────────

type ToggleState = {
  value: boolean;      // current optimistic value
  saving: boolean;     // request in-flight
  error: boolean;      // last request failed
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductsTable({
  products,
  selectedProduct,
  setSelectedProduct,
  onView,
  onToggleAvailability,
  userRole = "admin",
}: Props) {
  const { currency, useCents } = useCurrency();
  const isManager = userRole === "manager";

  // Keyed by `productId__sku`. Tracks optimistic value + request state.
  const [toggleStates, setToggleStates] = useState<Record<string, ToggleState>>({});

  const handleToggle = async (
    productId: string,
    sku: string,
    variantId: string,
    newValue: boolean
  ) => {
    const rowId = `${productId}__${sku}`;

    // 1. Optimistic update — UI responds immediately
    setToggleStates((prev) => ({
      ...prev,
      [rowId]: { value: newValue, saving: true, error: false },
    }));

    // 2. Notify parent (for any local state sync)
    onToggleAvailability?.(productId, sku, newValue);

    try {
      // 3. Persist to backend
      await apiClient.patch(`/branch-variants/${variantId}/availability`, {
        availability: newValue,
      });

      // 4. Mark save complete
      setToggleStates((prev) => ({
        ...prev,
        [rowId]: { value: newValue, saving: false, error: false },
      }));
    } catch (err) {
      console.error("Failed to update availability:", err);

      // 5. Revert on failure
      setToggleStates((prev) => ({
        ...prev,
        [rowId]: { value: !newValue, saving: false, error: true },
      }));
    }
  };

  // ── Manager view — one row per variant ──────────────────────────────────────
  if (isManager) {
    const variantRows = buildVariantRows(products);

    type TaggedProduct = Product & { _selectedVariantSku?: string };
    const selectedRowId = selectedProduct
      ? `${selectedProduct.id}__${(selectedProduct as TaggedProduct)._selectedVariantSku ?? ""}`
      : undefined;

    const managerColumns: Column<VariantRow>[] = [
       {
    key: "index",
    label: "#",
    render: (_, index) => index + 1,
  },
      {
        key: "productName",
        label: "Product · Variant",
        render: (row) => (
          <div>
            <p className="text-sm font-medium text-gray-800">{row.productName}</p>
            {row.variantLabel !== row.sku && (
              <p className="text-[11px] text-gray-400 mt-0.5">{row.variantLabel}</p>
            )}
          </div>
        ),
      },
      { key: "sku", label: "SKU" },
      { key: "category", label: "Category" },
      {
        key: "supplier",
        label: "Supplier",
        render: (row) => <span>{row.supplier || "—"}</span>,
      },
      {
        key: "basePrice",
        label: "Base Price",
        render: (row) => {
          const effective  = row.priceOverride ?? row.basePrice;
          const isOverride = row.priceOverride != null && row.priceOverride !== row.basePrice;
          const overrideColor = row.priceOverride != null
            ? row.priceOverride > row.basePrice
              ? "text-green-600 font-semibold"    // higher than base → green
              : row.priceOverride < row.basePrice
                ? "text-orange-600 font-semibold" // lower than base  → orange
                : "text-gray-700"                  // same             → default
            : "text-gray-700";
          return (
            <span className="inline-flex items-center gap-1">
              <span className={overrideColor}>
                {formatCurrency(effective, currency, useCents)}
              </span>
              {isOverride && (
                <span
                  title={`Branch override (base: ${formatCurrency(row.basePrice, currency, useCents)})`}
                  className="text-orange-500 text-[10px] font-bold leading-none select-none"
                >
                  ✦
                </span>
              )}
            </span>
          );
        },
      },
      {
        key: "sellingPrice",
        label: "Selling Price",
        render: (row) => {
          const effective  = row.sellingPriceOverride ?? row.sellingPrice;
          const isOverride = row.sellingPriceOverride != null && row.sellingPriceOverride !== row.sellingPrice;
          const overrideColor = row.sellingPriceOverride != null
            ? row.sellingPriceOverride > row.sellingPrice
              ? "text-green-600 font-semibold"    // higher than base → green
              : row.sellingPriceOverride < row.sellingPrice
                ? "text-orange-600 font-semibold" // lower than base  → orange
                : "text-gray-700"                  // same             → default
            : "text-gray-700";
          return (
            <span className="inline-flex items-center gap-1">
              <span className={overrideColor}>
                {formatCurrency(effective, currency, useCents)}
              </span>
              {isOverride && (
                <span
                  title={`Branch override (base: ${formatCurrency(row.sellingPrice, currency, useCents)})`}
                  className="text-orange-500 text-[10px] font-bold leading-none select-none"
                >
                  ✦
                </span>
              )}
            </span>
          );
        },
      },
      {
        key: "stockQty",
        label: "Stock Qty",
        render: (row) => (
          <span
            className={
              row.stockQty === 0
                ? "text-red-500 font-medium"
                : row.stockQty <= 10
                ? "text-orange-500 font-medium"
                : "text-gray-700"
            }
          >
            {row.stockQty}
          </span>
        ),
      },
      {
        key: "available",
        label: "Availability",
        render: (row) => {
          const ts = toggleStates[row.id];
          // Use optimistic value if we've toggled this row, otherwise use data from API
          const isAvailable = ts ? ts.value : row.available;
          const isSaving    = ts?.saving ?? false;
          const isError     = ts?.error  ?? false;

          return (
            <div className="flex items-center gap-2">
              <ToggleSwitch
                enabled={isAvailable}
                // Disable while request is in-flight to prevent double-clicks
                disabled={isSaving}
                onChange={(val) =>
                  handleToggle(row._product.id as string, row._sku, row._variantId, val)
                }
              />
              <span
                className={`text-[11px] font-medium ${
                  isError
                    ? "text-red-500"
                    : isSaving
                    ? "text-gray-400"
                    : isAvailable
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {isError ? "Failed — retry" : isSaving ? "Saving…" : isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
          );
        },
      },
      {
        key: "actions",
        label: "Actions",
        render: (row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              const tagged = { ...row._product, _selectedVariantSku: row._sku };
              onView(tagged as unknown as Product);
            }}
            className="text-blue-500 text-xs cursor-pointer hover:underline"
          >
            View
          </button>
        ),
      },
    ];

    return (
      <VariantTable<VariantRow>
        title="Products"
        data={variantRows}
        columns={managerColumns}
        emptyMessage="No variants found"
        selectedRowId={selectedRowId}
        onSelectRow={(row) => {
          if (!row) { setSelectedProduct(null); return; }
          const tagged = { ...row._product, _selectedVariantSku: row._sku };
          setSelectedProduct(tagged as unknown as Product);
        }}
      />
    );
  }

  // ── Owner / admin view — one row per product ─────────────────────────────────
  const productColumns: Column<Product>[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    {
      key: "supplier",
      label: "Supplier",
      render: (row) => {
        const display = resolveSupplierDisplay(row);
        return (
          <span className={display === "Multiple Suppliers" ? "text-orange-600 font-medium" : ""}>
            {display}
          </span>
        );
      },
    },
    {
      key: "variants",
      label: "Variants",
      render: (row) =>
        `${row.variants.length} variant${row.variants.length !== 1 ? "s" : ""}`,
    },
    {
      key: "price",
      label: "Price",
      render: (row) => {
        const prices = row.variants.map((v: { price: number }) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max
          ? formatCurrency(min, currency, useCents)
          : `${formatCurrency(min, currency, useCents)} – ${formatCurrency(max, currency, useCents)}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onView(row);
          }}
          className="text-blue-500 text-xs cursor-pointer hover:underline"
        >
          View
        </button>
      ),
    },
  ];

  return (
    <ProductTable<Product>
      title="Products"
      data={products}
      columns={productColumns}
      emptyMessage="No Product found"
      selectedRowId={selectedProduct?.id}
      onSelectRow={(row) => setSelectedProduct(row)}
    />
  );
}