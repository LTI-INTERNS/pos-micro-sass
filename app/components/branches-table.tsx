"use client";

import CommonTable, { Column } from "@/app/components/common/CommonTable";
import { Branch } from "@/app/Branchmanagement/data";

type BranchesTableProps = {
  branches: Branch[];
};

const columns: Column<Branch>[] = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "regno", label: "Registration Number" },
  { key: "email", label: "Email" },
  { key: "password", label: "Password", render: () => "••••••••" }, 
];

// Simple table wrapper that expects pre-filtered branch data.
export default function BranchesTable({ branches }: BranchesTableProps) {
  return (
    <CommonTable
      title="Branches"
      data={branches}
      columns={columns}
      emptyMessage="No branches found"
    />
  );
}
