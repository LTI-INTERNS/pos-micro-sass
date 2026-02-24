"use client";

import CommonTable, { Column } from "@/app/components/Admin/common/CommonTable";

export type Branch = {
  id: string;
  name: string;
  phone: string;
  address: string;
  regno: number;
  email: string;
  password: string;
};

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
