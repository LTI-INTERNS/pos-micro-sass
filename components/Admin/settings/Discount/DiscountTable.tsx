"use client";

import { useSession } from "next-auth/react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Discount } from "@/types/discount"; // Imported from your types folder

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
  const role = session?.user?.role?.toUpperCase();
  const userBranchId = session?.user?.branchId ?? "";

  const isManager = role === "MANAGER";
  const visibleDiscounts = isManager
    ? discounts.filter((d) => d.branchId === userBranchId)
    : discounts;

  const columns: Column<Discount>[] = [
     {
    key: "index",
    label: "",
    render: (_, index) => index + 1,
  },
    // { key: "id", label: "ID" },
    { key: "title", label: "Title" },
    {
      key: "percentage",
      label: "Discount (%)",
      render: (d) => `${d.percentage}%`,
    },
    { 
      key: "startDate", 
      label: "Start Date", 
      render: (d) => new Date(d.startDate).toLocaleDateString() 
    },
    { 
      key: "endDate", 
      label: "End Date",
      render: (d) => new Date(d.endDate).toLocaleDateString() 
    },
    {
      key: "branchId",
      label: "Branch",
      render: (d) => d.branch?.name || "Unknown",
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
              expired || !d.status
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {expired || !d.status ? "Expired" : "Active"}
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