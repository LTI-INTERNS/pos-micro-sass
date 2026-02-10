"use client";

import CommonTable, { Column } from "../common/CommonTable";

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
};

export default function SupplierTable({
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
}: Props) {
  const columns: Column<Supplier>[] = [
    { key: "id", label: "ID" },
    { key: "type", label: "Type" },
    { key: "name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "coverarea", label: "Cover Area" },
    { 
      key: "branches", 
      label: "Branches",
      render: (row) => row.branches.join(", ")
    },
    { key: "regNo", label: "Reg No" },
  ];

  return (
    <CommonTable
      title="Suppliers"
      data={suppliers}
      columns={columns}
      emptyMessage="No suppliers found"
      selectedRowId={selectedSupplier?.id}
      onSelectRow={(row) => {
        setSelectedSupplier(row);
      }}
    />
  );
}
