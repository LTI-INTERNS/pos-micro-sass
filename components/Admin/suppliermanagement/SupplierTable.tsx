"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";

export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
  address: string;
  phone: number;
  email: string;
  coverarea: string;
  regNo: string;
  branches: string[];
};

type Props = {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  setSelectedSupplier: (s: Supplier | null) => void;
  userRole?: "owner" | "admin" | "manager";
};

export default function SupplierTable({
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  userRole = "manager",
}: Props) {
  
  const canViewBranches = userRole === "owner" || userRole === "admin";
  const canManageSuppliers = userRole === "owner" || userRole === "admin";

  const columns: Column<Supplier>[] = [
     {
    key: "index",
    label: "#",
    render: (_, index) => index + 1,
  },
    
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "address", label: "Address" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "coverarea", label: "Cover Area" },
    ...(canViewBranches
      ? [
          {
            key: "branches" as keyof Supplier,
            label: "Branches",
            render: (row: Supplier) => row.branches.join(", "),
          },
        ]
      : []),
    { key: "regNo", label: "Reg No" },
  ];

  return (
    <CommonTable
      title="Suppliers"
      data={suppliers}
      columns={columns}
      emptyMessage="No suppliers found"
      selectedRowId={canManageSuppliers ? selectedSupplier?.id : undefined}
      onSelectRow={canManageSuppliers ? (row) => setSelectedSupplier(row) : undefined}
    />
  );
}