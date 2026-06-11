"use client";

import { GitBranch } from "lucide-react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import type { SaasOwnerCompany, SaasOwnerBranch } from "@/types/saas-owner.types";

interface Props {
  company: SaasOwnerCompany | null;
}

const columns: Column<SaasOwnerBranch>[] = [
  { key: "index", label: "", render: (_, i) => i + 1 },
  { key: "name", label: "Branch Name" },
  { key: "city", label: "City" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
  { key: "regno", label: "Reg. No." },
];

export default function BranchesPanel({ company }: Props) {
  if (!company) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center py-16 text-gray-300">
        <GitBranch size={32} className="mb-3" />
        <p className="text-sm font-medium">Select a company to view its branches</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <GitBranch size={15} className="text-orange-500" />
        <h3 className="text-sm font-bold text-gray-900">
          {company.name} — Branches
        </h3>
        <span className="ml-auto text-[10px] bg-orange-100 text-orange-600 font-bold px-2.5 py-0.5 rounded-full">
          {company.branchCount} total
        </span>
      </div>
      <CommonTable
        data={company.branches}
        columns={columns}
        emptyMessage="No branches found"
      />
    </div>
  );
}
