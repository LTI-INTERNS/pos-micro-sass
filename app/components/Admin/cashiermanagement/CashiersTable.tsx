"use client";

import CommonTable, { Column } from "../common/CommonTable";

export type Cashier = {
  id: string;
  name: string;
  cashierNo: string;
  totalRevenue: number;
  email: string;
  passwordMasked: string;
  pinMasked: string;

  // no longer required (tabs removed)
  status?: "new" | "top";
};

type Props = {
  cashiers: Cashier[];
};

export default function CashiersTable({ cashiers }: Props) {
  const columns: Column<Cashier>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "cashierNo", label: "Cashier No" },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      render: (c) => `Rs. ${c.totalRevenue.toLocaleString()}`,
    },
    { key: "email", label: "Email" },
    {
      key: "passwordMasked",
      label: "Password",
      render: (c) => c.passwordMasked || "••••••",
    },
    {
      key: "pinMasked",
      label: "PIN",
      align: "right",
      render: (c) => c.pinMasked || "****",
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