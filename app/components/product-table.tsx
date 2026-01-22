"use client";

import CommonTable, { Column } from "@/app/components/Dashboard/common/CommonTable";

type Product = {
  id: number;
  name: string;
  price: number;
  dis: number;
  tax: number;
  stock: number;
};

type Props = {
  products: Product[];
};

export default function ProductsTable({ products }: Props) {
  const columns: Column<Product>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    {
      key: "price",
      label: "Price",
      align: "right",
      render: (c) => `Rs. ${c.price.toLocaleString()}`,
    },
    {
      key: "dis",
      label: "Discount",
      align: "right",
      render: (c) => `${c.dis}%`,
    },
    {
      key: "tax",
      label: "Tax",
      align: "right",
      render: (c) => `${c.tax}%`,
    },
    {
      key: "stock",
      label: "Stock",
      align: "right",
    },
  ];

  return (
    <CommonTable
      title="Products"
      data={products}
      columns={columns}
      emptyMessage="No products found"
    />
  );
}
