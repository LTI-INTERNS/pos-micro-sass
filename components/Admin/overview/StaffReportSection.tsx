"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StaffReportItem from "@/components/Admin/overview/StaffReportItem";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { DateRangeParams, StaffPerformanceRow } from "@/types/analytics.types";

type Props = { dateRange?: DateRangeParams };

export default function StaffReportSection({ dateRange }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role              = session?.user?.role     ?? "";
  const branchId          = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [rows,    setRows]    = useState<StaffPerformanceRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: canSeeAllBranches ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getStaffPerformance(params, 4)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches, dateRange]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">Staff wise report</h3>
        <button
          onClick={() => router.push("/cashiermanagement")}
          className="text-sm text-orange-500 font-medium hover:underline cursor-pointer"
        >
          View All
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-400 animate-pulse">Loading…</div>
      ) : rows.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No sales data for this period.
        </div>
      ) : (
        rows.map((staff) => (
          <StaffReportItem
            key={staff.cashierId}
            name={staff.name}
            cashierNo={staff.cashierNo}
            imgUrl={staff.imgUrl}
            branchName={staff.branchName}
            revenue={staff.revenue}
            orderCount={staff.orderCount}
            showBranch={canSeeAllBranches}
          />
        ))
      )}
    </div>
  );
}
