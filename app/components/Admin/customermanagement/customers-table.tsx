import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";
import { Customer } from "@/app/customermanagement/data";

const customerColumns: Column<Customer>[] = [
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "promoCard", label: "Promo Card" },
  { key: "points", label: "Points" },
  { key: "email", label: "Email" },
  {
    key: "outstanding",
    label: "Outstanding",
    align: "right",
    render: (c) => `LKR ${c.outstanding.toLocaleString()}`,
  },
];

export default function CustomersTable({ customers }: { customers: Customer[] }) {
  return (
    <CommonTable
      title="Customers"
      data={customers}
      columns={customerColumns}
    />
  );
}
