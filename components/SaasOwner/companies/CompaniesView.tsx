"use client";

import { useState, useMemo } from "react";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/Admin/common/Search-bar";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import FilterChips from "@/components/Admin/common/FilterChips";
import LoadingState from "@/components/Admin/common/LoadingState";
import CompanyStatCardGrid from "@/components/SaasOwner/companies/CompanyStatCardGrid";
import BranchesPanel from "@/components/SaasOwner/companies/BranchesPanel";
import CompanyDetailModal from "@/components/SaasOwner/companies/CompanyDetailModal";
import PlanBadge from "@/components/SaasOwner/ui/PlanBadge";
import StatusDot from "@/components/SaasOwner/ui/StatusDot";
import BusinessTypePill from "@/components/SaasOwner/ui/BusinessTypePill";
import { saasOwnerService } from "@/lib/services/saas-owner.service";
import { queryKeys } from "@/lib/query-keys";
import { useSaasOwnerPolling } from "@/hooks/useSaasOwnerPolling";
import type { SaasOwnerCompany } from "@/types/saas-owner.types";
import type { SubscriptionType, BusinessTypeEnum } from "@/types/subscription.types";

const FILTER_LABELS: Record<string, string> = {
  subscription: "Plan",
  businessType: "Type",
  status: "Status",
  "subscription:FREE": "Free",
  "subscription:PRO": "Pro",
  "subscription:ENTERPRISE": "Enterprise",
  "status:ACTIVE": "Active",
  "status:INACTIVE": "Inactive",
};

type Filters = {
  subscription?: SubscriptionType;
  businessType?: BusinessTypeEnum;
  status?: "ACTIVE" | "INACTIVE";
};

export default function CompaniesView() {
  useSaasOwnerPolling();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<Filters>({});
  const [selectedCompany, setSelectedCompany] = useState<SaasOwnerCompany | null>(null);
  const [detailCompany, setDetailCompany] = useState<SaasOwnerCompany | null>(null);

  const { data: companies = [], isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.saasOwner.companies(),
    queryFn:  () => saasOwnerService.getAllCompanies(),
    staleTime: 0,
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return companies.filter((c) => {
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.city ?? "").toLowerCase().includes(q);
      const matchPlan = !filters.subscription || c.subscription === filters.subscription;
      const matchType = !filters.businessType || c.businessType === filters.businessType;
      const matchStatus = !filters.status || c.status === filters.status;
      return matchSearch && matchPlan && matchType && matchStatus;
    });
  }, [companies, search, filters]);

  const removeFilter = (key: string) =>
    setFilters((f) => { const n = { ...f }; delete (n as any)[key]; return n; });

  const columns: Column<SaasOwnerCompany>[] = [
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
    {
      key: "subscription",
      label: "Plan",
      render: (row) => <PlanBadge plan={row.subscription} />,
    },
    { key: "branchCount", label: "Branches", align: "center" },
    {
      key: "activeStaff",
      label: "Staff",
      align: "center",
      render: (row) => row.activeStaff ?? "—",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusDot status={row.status} />,
    },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button
          onClick={(e) => { e.stopPropagation(); setDetailCompany(row); }}
          className="flex items-center gap-1 text-orange-500 hover:text-orange-700 text-[10px] font-semibold cursor-pointer"
        >
          <Eye size={12} />
          View
        </button>
      ),
    },
  ];

  if (isLoading) return <LoadingState message="Loading companies…" />;

  if (isError) return (
    <div className="py-10 text-center text-red-400 text-sm">
      Failed to load companies.{" "}
      <button className="underline hover:text-red-300" onClick={() => void refetch()}>
        Retry
      </button>
    </div>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-extrabold text-gray-900">Companies</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          View all registered companies and their branch details
        </p>
      </div>

      <CompanyStatCardGrid companies={companies} />

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search companies…"
          className="flex-1 min-w-[200px]"
        />
        <div className="flex items-center gap-2 flex-wrap">
          {(
            [
              {
                key: "subscription",
                label: "All Plans",
                options: ["FREE", "PRO", "ENTERPRISE"] as SubscriptionType[],
              },
              {
                key: "businessType",
                label: "All Types",
                options: ["CAFE", "CLOTHING", "SUPERMARKET", "PHARMACY", "HARDWARE", "BOOKSHOP"] as BusinessTypeEnum[],
              },
              {
                key: "status",
                label: "All Status",
                options: ["ACTIVE", "INACTIVE"] as const,
              },
            ] as const
          ).map(({ key, label, options }) => (
            <select
              key={key}
              value={(filters as any)[key] ?? ""}
              onChange={(e) =>
                setFilters((f) => ({
                  ...f,
                  [key]: e.target.value || undefined,
                }))
              }
              className="text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 cursor-pointer focus:outline-none focus:border-orange-300"
            >
              <option value="">{label}</option>
              {options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          ))}
        </div>
      </div>

      <FilterChips
        filters={filters as Record<string, string | undefined>}
        labels={FILTER_LABELS}
        onRemove={removeFilter}
      />


      <div className="mt-4 grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        <div className="xl:col-span-2 max-h-[calc(100vh-280px)] overflow-y-auto rounded-xl border border-gray-100 bg-white">
          <CommonTable
            title={`${filtered.length} ${filtered.length === 1 ? "Company" : "Companies"}`}
            data={filtered}
            columns={columns}
            emptyMessage="No companies match your filters"
            selectedRowId={selectedCompany?.id}
            onSelectRow={setSelectedCompany}
          />
        </div>
        <div className="xl:sticky xl:top-[80px] max-h-[calc(100vh-280px)] overflow-y-auto rounded-xl">
          <BranchesPanel company={selectedCompany} />
        </div>
      </div>

      <CompanyDetailModal
        company={detailCompany}
        open={Boolean(detailCompany)}
        onClose={() => setDetailCompany(null)}
      />
    </div>
  );
}