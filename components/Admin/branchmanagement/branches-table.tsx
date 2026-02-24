"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import { Branch } from "@/lib/services/branch-service";

type Props = {
  branches: Branch[];
  selectedBranch: Branch | null;
  setSelectedBranch: (b: Branch | null) => void;
};

export default function BranchesTable({ branches, selectedBranch, setSelectedBranch, }: Props) {
  const columns: Column<Branch>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "regno", label: "Registration Number" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password", render: () => "••••••••" },
  ];

  return (
    <CommonTable
      title="Branches"
      data={branches}
      columns={columns}
      emptyMessage="No branches found"
      selectedRowId={selectedBranch?.id}
      onSelectRow={(row) => {
        setSelectedBranch(row);
      }}
    />
  );
}
