"use client";
import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 

export type Customer = {
  id: number;
  name: string;
  phone: string;
  promoCard: string;
  points: number;
  email: string;
  outstanding: number;
};
type Props = {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
};
export default function CustomerTable({ customers, selectedCustomer, setSelectedCustomer }: Props) {
  const columns: Column<Customer>[] = [
    {key: "id",label: "ID",},
    {key: "name",label: "Name",},
    {key: "phone",label: "Phone",},
    {key: "promoCard",label: "Promo Card",},
    {key: "points",label: "Points",},
    {key: "email",label: "Email",},
    {key: "outstanding",label: "Outstanding", align: "right",},
  ];

  return (
    <CommonTable
      title="Customers"
      data={customers} 
      columns={columns}
      emptyMessage="No Customers found"
      selectedRowId={selectedCustomer?.id}
      onSelectRow={(row) => {
        setSelectedCustomer(row);
      }}
    />
  );
}
