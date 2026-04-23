"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import TopSellingItem from "@/components/Admin/overview/TopSellingItem";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { DateRangeParams, TopSellingProduct } from "@/types/analytics.types";

type Props = { dateRange?: DateRangeParams };

export default function TopSellingSection({ dateRange }: Props) {
  const { data: session, status } = useSession();

  const role              = session?.user?.role     ?? "";
  const branchId          = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [items,   setItems]   = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: canSeeAllBranches ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getTopSelling(params, 4)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches, dateRange]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">Top selling items</h3>
        <button className="text-sm text-orange-500 font-medium hover:underline">
          View All
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-gray-400 animate-pulse">
          Loading…
        </div>
      ) : items.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">
          No sales data for this period.
        </div>
      ) : (
        items.map((item) => (
          <TopSellingItem
            key={item.variantId}
            name={item.name}
            // Pass null explicitly when image is empty — avoids Next.js Image crash
            image={item.image && item.image.trim() !== "" ? item.image : null}
            price={item.revenue}
            percentage={
              (item.pctChange >= 0 ? "+" : "") + item.pctChange.toFixed(1) + "%"
            }
            trend={item.trend}
          />
        ))
      )}
    </div>
  );
}