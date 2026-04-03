"use client";

import { useState } from "react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Product } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { BranchStock, ProductWithBranches } from "@/lib/mocks/productmanagement";
import ToggleSwitch from "@/components/Admin/common/ToggleSwitch";

type Props = {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  onView: (p: Product) => void;
  onToggleAvailability?: (productId: string, sku: string, available: boolean) => void;
  userRole?: "owner" | "admin" | "manager";
};

// ─── Supplier resolution helper ────────────────────────────────────────────────
// Derives the supplier display string for a product based on branch stock data.
// - All branches/variants share one supplier → show that supplier name
// - Branches differ → "Multiple Suppliers"
// - No branchStock → falls back to product.supplier

function resolveSupplierDisplay(product: Product): string {
  const branchStock: BranchStock | undefined = (product as ProductWithBranches).branchStock;

  if (!branchStock) return product.supplier ?? "—";

  const allSuppliers = new Set<string>();
  for (const branch of Object.values(branchStock)) {
    for (const variantDetail of Object.values(branch)) {
      if (variantDetail.supplier) {
        allSuppliers.add(variantDetail.supplier);
      }
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
  productName: string;
  variantLabel: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  stockQty: number;
  available: boolean;
};

function buildVariantRows(products: Product[]): VariantRow[] {
  const rows: VariantRow[] = [];
  for (const product of products) {
    const branchStock: BranchStock | undefined = (product as ProductWithBranches).branchStock;

    for (const variant of product.variants ?? []) {
      const variantLabel = variant.optionValues?.length
        ? variant.optionValues.map((o: { value: string }) => o.value).join(" · ")
        : variant.sku;

      // Resolve availability — check any branch that carries this SKU
      const branchDetail = branchStock
        ? Object.values(branchStock)
            .flatMap((b) => Object.entries(b))
            .find(([sku]) => sku === variant.sku)?.[1]
        : undefined;

      const available: boolean =
        (variant as typeof variant & { available?: boolean }).available ??
        branchDetail?.available ??
        true;

      rows.push({
        id: `${product.id}__${variant.sku}`,
        _product: product,
        _sku: variant.sku,
        productName: product.name,
        variantLabel,
        sku: variant.sku,
        category: product.category ?? "",
        supplier: product.supplier ?? "",
        price: variant.price,
        stockQty: (variant as typeof variant & { stockQty?: number }).stockQty ?? 0,
        available,
      });
    }
  }
  return rows;
}

// ─── Typed helpers to work around React.memo generic inference ───────────────

const VariantTable = CommonTable as <T extends { id?: string | number }>(
  props: React.ComponentProps<typeof CommonTable<T>>
) => React.ReactElement;

const ProductTable = CommonTable as <T extends { id?: string | number }>(
  props: React.ComponentProps<typeof CommonTable<T>>
) => React.ReactElement;

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

  // Local availability overrides keyed by row id (`productId__sku`).
  // This makes the toggle respond instantly without waiting for the parent
  // to propagate a products array update.
  const [availabilityOverrides, setAvailabilityOverrides] = useState<Record<string, boolean>>({});

  const handleToggle = (productId: string, sku: string, val: boolean) => {
    const rowId = `${productId}__${sku}`;
    setAvailabilityOverrides((prev) => ({ ...prev, [rowId]: val }));
    onToggleAvailability?.(productId, sku, val);
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
        key: "price",
        label: "Price",
        render: (row) => (
          <span className="text-orange-600 font-medium">
            {formatCurrency(row.price, currency, useCents)}
          </span>
        ),
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
          const isAvailable = availabilityOverrides[row.id] ?? row.available;
          return (
            <div className="flex items-center gap-2">
              <ToggleSwitch
                enabled={isAvailable}
                onChange={(val) => handleToggle(row._product.id as string, row._sku, val)}
              />
              <span
                className={`text-[11px] font-medium ${
                  isAvailable ? "text-green-600" : "text-gray-400"
                }`}
              >
                {isAvailable ? "Available" : "Unavailable"}
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