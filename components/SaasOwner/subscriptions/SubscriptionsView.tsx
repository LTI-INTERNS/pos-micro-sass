"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/Admin/common/StatCard";
import TabSelector from "@/components/Admin/common/TabSelector";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import LoadingState from "@/components/Admin/common/LoadingState";
import PlanOverviewCard from "@/components/SaasOwner/subscriptions/PlanOverviewCard";
import PlanBadge from "@/components/SaasOwner/ui/PlanBadge";
import StatusDot from "@/components/SaasOwner/ui/StatusDot";
import BusinessTypePill from "@/components/SaasOwner/ui/BusinessTypePill";
import { planCardsData } from "@/components/Admin/settings/subscriptionplan/planCardsData";
import { saasOwnerService } from "@/lib/services/saas-owner.service";
import { queryKeys } from "@/lib/query-keys";
import { useSaasOwnerPolling } from "@/hooks/useSaasOwnerPolling";
import type { SaasOwnerCompany } from "@/types/saas-owner.types";
import type { SubscriptionType } from "@/types/subscription.types";

const PLAN_PRICES: Record<SubscriptionType, number> = {
  FREE: 0,
  PRO: 29.99,
  ENTERPRISE: 99.99,
};

const TABS = [
  { id: "overview", label: "Plan Overview" },
  { id: "companies", label: "Companies by Plan" },
];

const byPlanColumns: Column<SaasOwnerCompany>[] = [
  { key: "index", label: "", render: (_, i) => i + 1 },
  {
    key: "name",
    label: "Company Name",
    render: (row) => <span className="font-semibold text-gray-900">{row.name}</span>,
  },
  {
    key: "businessType",
    label: "Type",
    render: (row) => <BusinessTypePill type={row.businessType} />,
  },
  { key: "city", label: "City", render: (row) => row.city ?? "—" },
  { key: "branchCount", label: "Branches", align: "center" as const },
  {
    key: "activeStaff",
    label: "Staff",
    align: "center" as const,
    render: (row) => row.activeStaff ?? "—",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => <StatusDot status={row.status} />,
  },
  {
    key: "registeredAt",
    label: "Since",
    render: (row) => new Date(row.registeredAt).getFullYear(),
  },
];

export default function SubscriptionsView() {
  useSaasOwnerPolling();

  const [tab, setTab] = useState("overview");

  const { data: companies = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.saasOwner.companies(),
    queryFn:  () => saasOwnerService.getAllCompanies(),
    staleTime: 0,
  });

  const counts = useMemo(
    () => ({
      FREE: companies.filter((c) => c.subscription === "FREE").length,
      PRO: companies.filter((c) => c.subscription === "PRO").length,
      ENTERPRISE: companies.filter((c) => c.subscription === "ENTERPRISE").length,
    }),
    [companies],
  );

  const totalRevenue = useMemo(
    () =>
      (["FREE", "PRO", "ENTERPRISE"] as SubscriptionType[]).reduce(
        (sum, type) => sum + counts[type] * PLAN_PRICES[type],
        0,
      ),
    [counts],
  );

  if (isLoading) return <LoadingState message="Loading subscription data…" />;

  if (isError) return (
    <div className="py-10 text-center text-red-400 text-sm">
      Failed to load subscription data.{" "}
      <button className="underline hover:text-red-300" onClick={() => void refetch()}>
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Subscription Plans</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Overview of all plans and company subscriptions
        </p>
      </div>

      {/* Revenue summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Monthly Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          trend="up"
          percentage="+8% this month"
          showDetailButton={false}
        />
        <StatCard
          title="Free Plan"
          value={String(counts.FREE)}
          trend="neutral"
          percentage="companies"
          showDetailButton={false}
        />
        <StatCard
          title="Pro Plan"
          value={String(counts.PRO)}
          trend="up"
          percentage={`$${(counts.PRO * PLAN_PRICES.PRO).toFixed(2)}/mo`}
          showDetailButton={false}
        />
        <StatCard
          title="Enterprise Plan"
          value={String(counts.ENTERPRISE)}
          trend="up"
          percentage={`$${(counts.ENTERPRISE * PLAN_PRICES.ENTERPRISE).toFixed(2)}/mo`}
          showDetailButton={false}
        />
      </div>

      <TabSelector
        tabs={TABS}
        activeTab={tab}
        onChange={setTab}
        className="mb-6 max-w-sm"
      />

      {tab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {planCardsData.map((plan) => (
            <PlanOverviewCard
              key={plan.id}
              plan={plan}
              subscriberCount={counts[plan.subType] ?? 0}
            />
          ))}
        </div>
      )}

      {tab === "companies" && (
        <div className="space-y-8">
          {planCardsData.map((plan) => {
            const planCompanies = companies.filter(
              (c) => c.subscription === plan.subType
            );
            return (
              <div key={plan.id}>
                <div className="flex items-center gap-3 mb-3">
                  <PlanBadge plan={plan.subType} />
                  <span className="text-sm font-bold text-gray-900">
                    {plan.name} Plan
                  </span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 rounded-full px-2.5 py-0.5 font-semibold">
                    {planCompanies.length}{" "}
                    {planCompanies.length === 1 ? "company" : "companies"}
                  </span>
                </div>
                <CommonTable
                  data={planCompanies}
                  columns={byPlanColumns}
                  emptyMessage={`No companies on ${plan.name} plan`}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
