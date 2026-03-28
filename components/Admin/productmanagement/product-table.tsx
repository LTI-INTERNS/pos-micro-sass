"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Product } from "@/lib/services";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Props = {
  products: Product[];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
  onView: (p: Product) => void;
  userRole?: "owner" | "admin" | "manager";
};

// ─── Flat variant row shape (manager view) ────────────────────────────────────
// `id` satisfies CommonTable's  T extends { id?: string | number }  constraint.

export type VariantRow = {
  id: string;                  // = `${product.id}__${variant.sku}`
  _product: Product;           // parent product — needed when row is selected
  _sku: string;                // which variant was clicked
  productName: string;
  variantLabel: string;
  sku: string;
  category: string;
  supplier: string;
  price: number;
  stockQty: number;
};

function buildVariantRows(products: Product[]): VariantRow[] {
  const rows: VariantRow[] = [];
  for (const product of products) {
    for (const variant of product.variants ?? []) {
      const variantLabel = variant.optionValues?.length
        ? variant.optionValues.map((o: { value: string }) => o.value).join(" · ")
        : variant.sku;

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
        stockQty: (variant as any).stockQty ?? 0,
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
  userRole = "admin",
}: Props) {
  const { currency, useCents } = useCurrency();
  const isManager = userRole === "manager";

  // ── Manager view — one row per variant ──────────────────────────────────────
  if (isManager) {
    const variantRows = buildVariantRows(products);

    const selectedRowId = selectedProduct
      ? `${selectedProduct.id}__${(selectedProduct as any)._selectedVariantSku ?? ""}`
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
    { key: "supplier", label: "Supplier" },
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