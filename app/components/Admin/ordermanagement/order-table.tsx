import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Order } from "@/app/ordermanagement/data";

const orderColumns: Column<Order>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "price", label: "Price" },
  { key: "discount", label: "Discount" },
  { key: "tax", label: "Tax" },
  { key: "stock", label: "Stock" },
];

export default function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <CommonTable
      title="Orders"
      data={orders}
      columns={orderColumns}
    />
  );
}
