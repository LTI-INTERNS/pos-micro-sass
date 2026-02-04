import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Product } from "@/app/productmanagement/data";

type Props = {
  products: Product [];
  selectedProduct: Product | null;
  setSelectedProduct: (p: Product | null) => void;
}

const productColumns: Column<Product>[] = [
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

export default function ProductsTable({ products, selectedProduct, setSelectedProduct }: Props) {
  return (
    <CommonTable
      title="Products"
      data={products}
      columns={productColumns}
      emptyMessage="No Product found"
      selectedRowId={selectedProduct?.id}
      onSelectRow={(row) => {
        if (selectedProduct?.id === row.id) {
          setSelectedProduct(null);
        } else {
          setSelectedProduct(row);
        }
      }} 
    />
  );
}