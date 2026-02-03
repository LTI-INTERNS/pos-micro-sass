import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Order } from "@/app/ordermanagement/data";

const orderColumns: Column<Order>[] = [
  { key: "id", label: "Order ID" },
  { key: "dateTime", label: "Date & Time" },
  { key: "branch", label: "Branch" },
  { key: "cashier", label: "Cashier" },
  { key: "paymenttype", label: "Payment" },
  { key: "totalamount", label: "Total Amount", align: "right" },
  { key: "status", label: "Status" },
  { key: "action", label: "Action" },
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
