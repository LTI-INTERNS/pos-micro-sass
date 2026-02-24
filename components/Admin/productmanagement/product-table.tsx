"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Product } from "@/app/productmanagement/data";
import { useCurrency } from "@/app/context/CurrencyContext";
import { formatCurrency } from "@/app/context/formatCurrency";

type Props = {
  products: Product [];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
}

export default function ProductsTable({ products, selectedProduct, setSelectedProduct }: Props) {
  const { currency, useCents } = useCurrency();

  const productColumns: Column<Product>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "category", label: "Category" },
  { key: "supplier", label: "Supplier"},
  { key: "price", label: "Price", render: (row) => formatCurrency(row.price, currency, useCents) },
  { key: "discount", label: "Discount (%)" },
  { key: "tax", label: "Tax (%)" },
  { key: "stock", label: "Stock" },
  { key: "lowstock", label: "Low Stock/ Availability" },

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