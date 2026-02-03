import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";

export type Product = {
  id: number;
  name: string;
  price: number;
  discount: number;
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
  { key: "category", label: "Category" },
  { key: "supplier", label: "Supplier"},
  { key: "price", label: "Price (LKR)" },
  { key: "discount", label: "Discount (%)" },
  { key: "tax", label: "Tax (%)" },
  { key: "stock", label: "Stock" },
  { key: "lowstock", label: "Low Stock/ Availability" },

];

export default function ProductsTable({ products }: { products: Product[] }) {
  return (
    <CommonTable
      title="Products"
      data={products} 
      columns={columns}
      emptyMessage="No Products found"
    />
  );
};
