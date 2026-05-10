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

type CardData = {
  title:      string;
  value?:     string;
  amount?:    number;
  percentage: string;
  trend:      "up" | "down";
  caption:    string;
};

function buildCards(stats: OverviewStats, loading: boolean): CardData[] {
  const placeholder = (title: string, isAmount: boolean): CardData => ({
    title,
    ...(isAmount ? { amount: undefined } : { value: "—" }),
    percentage: "",
    trend:      "up",
    caption:    "vs previous period",
  });

  if (loading) {
    return [
      placeholder("Total Sales",        true),
      placeholder("Customers",          false),
      placeholder("Expenses",           true),
      placeholder("Low Stock Products", false),
    ];
  }

  return [
    {
      title:      "Total Sales",
      amount:     stats.totalRevenue.value,
      percentage: formatPct(stats.totalRevenue.pctChange),
      trend:      stats.totalRevenue.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Customers",
      value:      String(stats.totalCustomers.value),
      percentage: formatPct(stats.totalCustomers.pctChange),
      trend:      stats.totalCustomers.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Expenses",
      amount:     stats.totalExpenses.value,
      percentage: formatPct(stats.totalExpenses.pctChange),
      trend:      stats.totalExpenses.pctChange >= 0 ? "up" : "down",
      caption:    "vs previous period",
    },
    {
      title:      "Low Stock Products",
      value:      String(stats.lowStockCount),
      percentage: "",
      trend:      "down",
      caption:    "products below threshold",
    },
  ];
}

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
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches, dateRange]);

  const emptyStats: OverviewStats = {
    totalRevenue:   { value: 0, pctChange: 0 },
    totalOrders:    { value: 0, pctChange: 0 },
    totalCustomers: { value: 0, newInPeriod: 0, pctChange: 0 },
    totalExpenses:  { value: 0, pctChange: 0 },
    lowStockCount:  0,
  };

  const cards = buildCards(stats ?? emptyStats, loading);

  const handleDetailClick = (title: string) => {
    const routeMap: Record<string, string> = {
      Customers:           "/customermanagement",
      "Low Stock Products": "/productmanagement",
      "Total Sales":        "/reports",
      Expenses:             "/expensesmanagement",
    };
    const route = routeMap[title];
    if (route) router.push(route);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          amount={card.amount}
          percentage={card.percentage}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={true}
          onDetailClick={() => handleDetailClick(card.title)}
        />
      ))}
    </div>
  );
}