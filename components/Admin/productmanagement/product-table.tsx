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
}

export default function ProductsTable({ products, selectedProduct, setSelectedProduct, onView, }: Props) {
  const { currency, useCents } = useCurrency();

  const productColumns: Column<Product>[] = [
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "supplier", label: "Supplier" },

    // ✅ show variant count
    {
      key: "variants",
      label: "Variants",
      render: (row) => `${row.variants.length} variants`,
    },

    // ✅ show price range
    {
      key: "price",
      label: "Price",
      render: (row) => {
        const prices = row.variants.map((v: { price: number }) => v.price);
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        return min === max
          ? formatCurrency(min, currency, useCents)
          : `${formatCurrency(min, currency, useCents)} - ${formatCurrency(max, currency, useCents)}`;
      },
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <button
          onClick={() => onView(row)}
          className="text-blue-500 text-xs cursor-pointer hover:underline"
        >
          View
        </button>
      ),
    }
  ];

  return (
    <CommonTable
      title="Products"
      data={products}
      columns={productColumns}
      emptyMessage="No Product found"
      selectedRowId={selectedProduct?.id}
      onSelectRow={(row) => {
        setSelectedProduct(row);
      }}
    />
  );
}