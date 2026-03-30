"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { Customer } from "@/lib/services/customer-service";

type Props = {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
};
export default function CustomerTable({ customers, selectedCustomer, setSelectedCustomer }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Customer>[] = [
    { key: "id", label: "ID", },
    { key: "name", label: "Name", },
    { key: "phone", label: "Phone", },
    { key: "promoCard", label: "Promo Card", },
    { key: "points", label: "Points", },
    { key: "email", label: "Email", },
    
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
