"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopSellingItem from "@/components/Admin/overview/TopSellingItem";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { DateRangeParams, TopSellingProduct } from "@/types/analytics.types";

function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0 animate-pulse">
      <div className="w-6 h-6 rounded-full bg-gray-100 shrink-0" />
      <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-100 rounded w-2/3" />
        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
      </div>
      <div className="text-right space-y-1.5 shrink-0">
        <div className="h-3 bg-gray-100 rounded w-16 ml-auto" />
        <div className="h-2.5 bg-gray-100 rounded w-10 ml-auto" />
      </div>
    </div>
  );
}

type Props = { dateRange?: DateRangeParams };

export default function TopSellingSection({ dateRange }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role = session?.user?.role ?? "";
  const branchId = session?.user?.branchId ?? "";
  const isCompanyWide = role === "OWNER" || role === "ADMIN";

  const [items, setItems] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: isCompanyWide ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getTopSelling(params, 5)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [status, branchId, isCompanyWide, dateRange]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Top Selling Items</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCompanyWide ? 'All branches · by revenue' : 'Your branch · by revenue'}
          </p>
        </div>
        <button
          className="text-xs text-orange-500 font-medium hover:text-orange-600 transition-colors cursor-pointer"
          onClick={() => router.push("/productmanagement")}
        >
          View all →
        </button>
      </div>

      {/* List */}
      <div className="flex-1">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
        ) : items.length === 0 ? (
          <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm font-medium">No product data</p>
            <p className="text-xs">Try a different date range</p>
          </div>
        ) : (
          items.map((item, i) => (
            <TopSellingItem
              key={item.variantId}
              rank={i + 1}
              name={item.name}
              image={item.image && item.image.trim() !== "" ? item.image : null}
              price={item.revenue}
              orderCount={item.orderCount}
              percentage={(item.pctChange >= 0 ? "+" : "") + item.pctChange.toFixed(1) + "%"}
              trend={item.trend}
            />
          ))
        )}
      </div>
    </div>
  );
}