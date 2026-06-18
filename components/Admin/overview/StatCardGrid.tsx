"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatCard from "@/components/Admin/common/StatCard";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { DateRangeParams, OverviewStats } from "@/types/analytics.types";

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

type CardDef = {
  title:      string;
  value?:     string;
  amount?:    number;
  percentage: string;
  trend:      "up" | "down" | "neutral";
  caption:    string;
};

function buildCards(stats: OverviewStats): CardDef[] {
  return [
    {
      title:      "Total Sales",
      amount:     stats.totalRevenue.value,
      percentage: formatPct(stats.totalRevenue.pctChange),
      trend:      stats.totalRevenue.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Orders",
      value:      stats.totalOrders.value.toLocaleString(),
      percentage: formatPct(stats.totalOrders.pctChange),
      trend:      stats.totalOrders.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Customers",
      value:      stats.totalCustomers.value.toLocaleString(),
      percentage: formatPct(stats.totalCustomers.pctChange),
      trend:      stats.totalCustomers.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Low Stock Items",
      value:      String(stats.lowStockCount),
      percentage: "",
      trend:      stats.lowStockCount > 0 ? "down" : "neutral",
      caption:    stats.lowStockCount > 0 ? "need attention" : "all stocked",
    },
  ];
}

const ROUTE_MAP: Record<string, string> = {
  "Total Sales":    "/reports",
  Orders:           "/reports",
  Customers:        "/customermanagement",
  "Low Stock Items":"/productmanagement",
};

type Props = { dateRange?: DateRangeParams };

export default function StatCardGrid({ dateRange }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role              = session?.user?.role     ?? "";
  const branchId          = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [stats,   setStats]   = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;

    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: canSeeAllBranches ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getOverviewStats(params)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches, dateRange]);

  const emptyStats: OverviewStats = {
    totalRevenue:   { value: 0, pctChange: 0 },
    totalOrders:    { value: 0, pctChange: 0 },
    totalCustomers: { value: 0, newInPeriod: 0, pctChange: 0 },
    totalExpenses:  { value: 0, pctChange: 0 },
    lowStockCount:  0,
  };

  const cards = loading ? null : buildCards(stats ?? emptyStats);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => (
            /* Skeleton card */
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse flex flex-col gap-3"
            >
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-9 bg-gray-100 rounded w-2/3" />
              <div className="h-5 bg-gray-100 rounded-full w-1/3" />
              <div className="mt-4 h-3 bg-gray-100 rounded w-1/4" />
            </div>
          ))
        : cards!.map((card) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              amount={card.amount}
              percentage={card.percentage}
              trend={card.trend}
              caption={card.caption}
              showDetailButton
              onDetailClick={() => {
                const route = ROUTE_MAP[card.title];
                if (route) router.push(route);
              }}
            />
          ))}
    </div>
  );
}