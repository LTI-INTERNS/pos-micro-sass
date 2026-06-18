"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StaffReportItem from "@/components/Admin/overview/StaffReportItem";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { DateRangeParams, StaffPerformanceRow } from "@/types/analytics.types";

function SkeletonRow() {
  return (
    <div className="py-3 border-b border-gray-50 last:border-0 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-4 h-3 bg-gray-100 rounded shrink-0" />
        <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
          <div className="flex justify-between">
            <div className="h-2.5 bg-gray-100 rounded w-1/5" />
            <div className="h-2.5 bg-gray-100 rounded w-1/6" />
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full w-full" />
        </div>
      </div>
    </div>
  );
}

type Props = { dateRange?: DateRangeParams };

export default function StaffReportSection({ dateRange }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role              = session?.user?.role     ?? "";
  const branchId          = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [rows, setRows] = useState<StaffPerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: canSeeAllBranches ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getStaffPerformance(params, 5)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches, dateRange]);

  const maxRevenue = rows.length > 0 ? Math.max(...rows.map((r) => r.revenue)) : 1;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Staff Performance</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {canSeeAllBranches ? 'All branches · by revenue' : 'Your branch · by revenue'}
          </p>
        </div>
        <button
          onClick={() => router.push("/cashiermanagement")}
          className="text-xs text-orange-500 font-medium hover:text-orange-600 transition-colors cursor-pointer"
        >
          Manage staff →
        </button>
      </div>

      {/* List */}
      <div className="flex-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : rows.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm font-medium">No staff data</p>
            <p className="text-xs">Try a different date range</p>
          </div>
        ) : (
          rows.map((staff, i) => (
            <StaffReportItem
              key={staff.cashierId}
              rank={i + 1}
              name={staff.name}
              cashierNo={staff.cashierNo}
              imgUrl={staff.imgUrl}
              branchName={staff.branchName}
              revenue={staff.revenue}
              orderCount={staff.orderCount}
              showBranch={canSeeAllBranches}
              maxRevenue={maxRevenue}
            />
          ))
        )}
      </div>
    </div>
  );
}