"use client";

import CommonTable, { Column } from "@/components/Admin/common/CommonTable";

export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
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
  isSuperAdmin?: boolean;
};

export default function SupplierTable({
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  isSuperAdmin = false,
}: Props) {
  const columns: Column<Supplier>[] = [
    { key: "id", label: "ID" },
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "coverarea", label: "Cover Area" },
    ...(isSuperAdmin
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
      selectedRowId={isSuperAdmin ? selectedSupplier?.id : undefined}
      onSelectRow={isSuperAdmin ? (row) => setSelectedSupplier(row) : undefined}
    />
  );
}