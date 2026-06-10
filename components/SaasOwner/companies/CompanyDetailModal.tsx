"use client";

import { Globe, MapPin, Mail, Phone, Calendar, GitBranch, Users, CreditCard } from "lucide-react";
import ModalShell from "@/components/Admin/common/ModalShell";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import PlanBadge from "@/components/SaasOwner/ui/PlanBadge";
import StatusDot from "@/components/SaasOwner/ui/StatusDot";
import BusinessTypePill from "@/components/SaasOwner/ui/BusinessTypePill";
import type { SaasOwnerCompany, SaasOwnerBranch } from "@/types/saas-owner.types";

interface Props {
  company: SaasOwnerCompany | null;
  open: boolean;
  onClose: () => void;
}

const branchColumns: Column<SaasOwnerBranch>[] = [
  { key: "index", label: "", render: (_, i) => i + 1 },
  { key: "name", label: "Branch Name" },
  { key: "city", label: "City" },
  { key: "address", label: "Address" },
  { key: "regno", label: "Reg. No." },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
];

export default function CompanyDetailModal({ company, open, onClose }: Props) {
  if (!company) return null;

  const infoRows = [
    { icon: Globe, label: "Country", value: company.country ?? "—" },
    { icon: MapPin, label: "City", value: company.city ?? "—" },
    { icon: Mail, label: "Email", value: company.email },
    { icon: Phone, label: "Phone", value: company.phone },
    {
      icon: Calendar,
      label: "Registered",
      value: new Date(company.registeredAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    },
  ];

  const statStrip = [
    { icon: GitBranch, label: "Branches", value: company.branchCount },
    { icon: Users, label: "Active Staff", value: company.activeStaff ?? "—" },
    { icon: CreditCard, label: "Plan", value: company.subscription },
  ];

  return (
    <ModalShell
      open={open}
      title={company.name}
      onClose={onClose}
      widthClassName="w-[860px] max-w-[95vw]"
    >
      {/* Header chips */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <BusinessTypePill type={company.businessType} />
        <PlanBadge plan={company.subscription} />
        <StatusDot status={company.status} />
      </div>

      {/* Info grid — no sensitive data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-6">
        {infoRows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Icon size={13} className="text-orange-500" />
            </span>
            <div>
              <p className="text-[10px] text-gray-400 font-medium">{label}</p>
              <p className="text-xs text-gray-800 font-semibold">{String(value)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Key stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {statStrip.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="bg-orange-50 rounded-xl p-4 flex items-center gap-3"
          >
            <Icon size={18} className="text-orange-500 flex-shrink-0" />
            <div>
              <p className="text-lg font-extrabold text-gray-900">{String(value)}</p>
              <p className="text-[10px] text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Branches table */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch size={14} className="text-orange-500" />
          <h3 className="text-sm font-bold text-gray-800">Branch Locations</h3>
        </div>
        <CommonTable
          data={company.branches}
          columns={branchColumns}
          emptyMessage="No branch data available"
        />
      </div>
    </ModalShell>
  );
}
