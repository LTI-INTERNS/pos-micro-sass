"use client";

import CommonTable, { Column } from "@/app/components/common/CommonTable";

type Cashier = {
  id: number;
  name: string;
  cashno: number;
  totalre: number;
  email: string;
  password: string;
  pin: number;
};

type Props = {
  cashiers: Cashier[];
};

export default function CashiersTable({ cashiers }: Props) {
  const columns: Column<Cashier>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "cashno", label: "Cashier No" },
    {
      key: "totalre",
      label: "Total Revenue",
      render: (c) => `Rs. ${c.totalre.toLocaleString()}`,
    },
    { key: "email", label: "Email" },
    {
      key: "password",
      label: "Password",
      render: () => "••••••",
    },
    {
      key: "pin",
      label: "PIN",
      align: "right",
      render: () => "****",
    },
  ];

  return (
    <CommonTable
      title="Cashiers"
      data={cashiers}
      columns={columns}
      emptyMessage="No cashiers found"
    />
  );
}
