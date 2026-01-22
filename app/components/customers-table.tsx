"use client";

import CommonTable, { Column } from "@/app/components/CommonTable";

type Customer = {
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
};

export default function CustomersTable({ customers }: Props) {
  const columns: Column<Customer>[] = [
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "promoCard", label: "Promo Card" },
    { key: "points", label: "Points" },
    { key: "email", label: "Email" },
    {
      key: "outstanding",
      label: "Outstanding Payments",
      align: "right",
      render: (c) => (
        <>
          <div className="font-semibold text-gray-900">
            ${c.outstanding.toLocaleString()}
          </div>
          <div className="text-[10px] font-medium text-green-500">
            ${c.outstanding.toLocaleString()}
          </div>
        </>
      ),
    },
  ];

  return (
    <CommonTable
      title="Customers"
      data={customers}
      columns={columns}
      emptyMessage="No customers found"
    />
  );
}
