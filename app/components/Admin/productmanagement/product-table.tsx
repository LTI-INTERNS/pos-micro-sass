import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Product } from "@/app/productmanagement/data";

const productColumns: Column<Product>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "discount", label: "Discount" },
  { key: "tax", label: "Tax" },
  { key: "stock", label: "Stock" },
];

export default function ProductsTable({ products }: { products: Product[] }) {
  return (
    <CommonTable
      title="Products"
      data={products}
      columns={productColumns}
    />
  );
}
