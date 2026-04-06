"use client";

import Image from "next/image";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type Cashier = {
  id: string;
  name: string;
  imgUrl?: string | null;
  cashierNo: string;
  totalRevenue: number;
  email: string;
  passwordMasked: string;
  pinMasked: string;
  status?: "Active" | "Deactive";
};

type Props = {
  cashiers: Cashier[];
  selectedRowId?: string;
  onSelectRow?: (row: Cashier | null) => void;
};

function AvatarCell({ name, imgUrl }: { name: string; imgUrl?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      {imgUrl ? (
        <Image
          src={imgUrl}
          alt={name}
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-bold shrink-0">
          {initials}
        </div>
      )}
      <span>{name}</span>
    </div>
  );
}

export default function CashiersTable({ cashiers, selectedRowId, onSelectRow }: Props) {
  const { currency, useCents } = useCurrency();

  const columns: Column<Cashier>[] = [
     {
    key: "index",
    label: "#",
    render: (_, index) => index + 1,
  },
    {
      key: "name",
      label: "Name",
      render: (c) => <AvatarCell name={c.name} imgUrl={c.imgUrl} />,
    },
    { key: "cashierNo", label: "Cashier No" },
    {
      key: "totalRevenue",
      label: "Total Revenue",
      render: (c) => formatCurrency(c.totalRevenue, currency, useCents),
    },
    { key: "email", label: "Email" },
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
      onSelectRow={onSelectRow}
    />
  );
}