"use client";

import { useSession } from "next-auth/react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";

export type Discount = {
  id: string;
  title: string;
  percentage: number;
  createdDate: string;
  endDate: string;
  branch?: string;
  status?: "Active" | "Expired";
};

type Props = {
  discounts: Discount[];
  selectedRowId?: string;
  onSelectRow?: (row: Discount | null) => void;
};

const isExpired = (endDate: string) => {
  const today = new Date();
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  return end < today;
};

export default function DiscountTable({
  discounts,
  selectedRowId,
  onSelectRow,
}: Props) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const branchName = session?.user?.branchName ?? "";

  const isManager = role === "MANAGER";
  const visibleDiscounts = isManager
    ? discounts.filter(
        (d) => !d.branch || d.branch === branchName
      )
    : discounts;

  const columns: Column<Discount>[] = [
     {
    key: "index",
    label: "#",
    render: (_, index) => index + 1,
  },
    // { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    {
      key: "percentage",
      label: "Discount (%)",
      render: (d) => `${d.percentage}%`,
    },
    { key: "createdDate", label: "Created Date" },
    { key: "endDate", label: "End Date" },
    {
      key: "branch",
      label: "Branch",
      render: (d) => d.branch || "All",
    },
    {
      key: "status",
      label: "Status",
      align: "center",
      render: (d) => {
        const expired = isExpired(d.endDate);

        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              expired
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {expired ? "Expired" : "Active"}
          </span>
        );
      },
    },
  ];

  return (
    <CommonTable
      title="Discounts"
      data={visibleDiscounts}
      columns={columns}
      emptyMessage="No discounts found"
      selectedRowId={selectedRowId}
      onSelectRow={onSelectRow}
    />
  );
}
