"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable"; 
import { useCurrency } from "@/app/context/CurrencyContext";

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
  const { currency } = useCurrency();

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(value);

  const columns: Column<Customer>[] = [
    {key: "id",label: "ID",},
    {key: "name",label: "Name",},
    {key: "phone",label: "Phone",},
    {key: "promoCard",label: "Promo Card",},
    {key: "points",label: "Points",},
    {key: "email",label: "Email",},
    {
      key: "outstanding",
      label: "Outstanding",
      align: "right",
      render: (row) => formatAmount(row.outstanding),
    },
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
