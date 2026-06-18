"use client";

import StatCard from "@/components/Admin/common/StatCard";
import type { SaasOwnerCompany } from "@/types/saas-owner.types";

interface Props {
  companies: SaasOwnerCompany[];
}

export default function CompanyStatCardGrid({ companies }: Props) {
  const total = companies.length;
  const active = companies.filter((c) => c.status === "ACTIVE").length;
  const totalBranches = companies.reduce((s, c) => s + c.branchCount, 0);
  const enterprise = companies.filter((c) => c.subscription === "ENTERPRISE").length;
  const pro = companies.filter((c) => c.subscription === "PRO").length;
  const paid = enterprise + pro;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Companies"
        value={String(total)}
        trend="up"
        percentage="+3 this month"
        showDetailButton={false}
      />
      <StatCard
        title="Active Companies"
        value={String(active)}
        trend="neutral"
        percentage={`${total > 0 ? Math.round((active / total) * 100) : 0}% active`}
        showDetailButton={false}
      />
      <StatCard
        title="Total Branches"
        value={String(totalBranches)}
        trend="up"
        percentage="+12 this month"
        showDetailButton={false}
      />
      <StatCard
        title="Paid Subscriptions"
        value={String(paid)}
        trend="up"
        percentage={`${enterprise} Enterprise · ${pro} Pro`}
        showDetailButton={false}
      />
    </div>
  );
}
