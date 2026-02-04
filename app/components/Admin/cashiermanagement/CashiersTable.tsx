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
  status?: "Active" | "Deactive"
};

type Props = {
  cashiers: Cashier[];
  selectedRowId?: string;                // NEW
  onSelectRow?: (row: Cashier) => void;  // NEW
};

export default function CashiersTable({ cashiers, selectedRowId, onSelectRow }: Props) {
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
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (c) => {
        const status = c.status ?? "Active";

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium
              ${
                status === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
          >
            {status}
          </span>
        );
      },
    },  
  ];

  return (
    <CommonTable
      title="Cashiers"
      data={cashiers}
      columns={columns}
      emptyMessage="No cashiers found"
      selectedRowId={selectedRowId}
      onSelectRow={(row) => {
        if (row.id === selectedRowId) onSelectRow?.(null as any);
        else onSelectRow?.(row);
      }}
    />
  );
}