"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import StatCard from "@/components/Admin/common/StatCard";
import { calcStatSummary } from "@/lib/utils/statCardUtils";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type {
  DateRangeParams,
  OverviewStats,
  ProfitSummary,
} from "@/types/analytics.types";

type AmountRow = { date: string; amount: number };

type Props = {
  sales?: AmountRow[];
  expenses?: AmountRow[]; // fallback only (used when API is unavailable)
  transactionCount?: number; // fallback only (used when API is unavailable)
  dateRange?: DateRangeParams;
};

function pctLabel(pct: number): string {
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}%`;
}

function trendFromPct(pct: number): "up" | "down" | "neutral" {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "neutral";
}

export default function ReportStatCardGrid({
  sales = [],
  expenses = [],
  transactionCount = 0,
  dateRange,
}: Props) {
  const { status } = useSession();

  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [profitSummary, setProfitSummary] = useState<ProfitSummary | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;

    let cancelled = false;
    setLoadingStats(true);

    Promise.all([
      overviewAnalyticsService.getOverviewStats(dateRange),
      overviewAnalyticsService
        .getProfitReport(dateRange, 1, 1)
        .then((r) => r.summary),
    ])
      .then(([nextStats, nextProfitSummary]) => {
        if (cancelled) return;
        setStats(nextStats);
        setProfitSummary(nextProfitSummary);
      })
      .catch(() => {
        if (cancelled) return;
        setStats(null);
        setProfitSummary(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoadingStats(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, dateRange]);

  const fallbackSalesStats = calcStatSummary(sales, "date", "amount");
  const fallbackExpenseStats = calcStatSummary(expenses, "date", "amount");

  const totalSalesAmount = stats?.totalRevenue.value ?? fallbackSalesStats.total;
  const totalExpensesAmount =
    stats?.totalExpenses.value ?? fallbackExpenseStats.total;
  const fallbackNetProfitAmount = totalSalesAmount - totalExpensesAmount;
  const grossProfitAmount =
    profitSummary?.grossProfit.value ?? fallbackNetProfitAmount;

  const statCards = [
    {
      title: "Total Sales",
      amount: loadingStats ? undefined : totalSalesAmount,
      value: loadingStats ? "…" : undefined,
      percentage: stats
        ? pctLabel(stats.totalRevenue.pctChange)
        : fallbackSalesStats.totalTrend.label,
      trend: stats
        ? trendFromPct(stats.totalRevenue.pctChange)
        : fallbackSalesStats.totalTrend.trend,
      caption: "vs previous period",
    },
    {
      title: "Total Expenses",
      amount: loadingStats ? undefined : totalExpensesAmount,
      value: loadingStats ? "…" : undefined,
      percentage: stats
        ? pctLabel(stats.totalExpenses.pctChange)
        : fallbackExpenseStats.totalTrend.label,
      trend: stats
        ? trendFromPct(stats.totalExpenses.pctChange)
        : fallbackExpenseStats.totalTrend.trend,
      caption: "vs previous period",
    },
    {
      title: "Gross Profit",
      amount: loadingStats ? undefined : grossProfitAmount,
      value: loadingStats ? "…" : undefined,
      percentage: profitSummary
        ? pctLabel(profitSummary.grossProfit.pctChange)
        : "N/A",
      trend: profitSummary
        ? trendFromPct(profitSummary.grossProfit.pctChange)
        : ("neutral" as const),
      caption: profitSummary ? "vs previous period" : "unavailable",
    },
    {
      title: "Transactions Count",
      value: loadingStats
        ? "…"
        : String(stats?.totalOrders.value ?? transactionCount),
      percentage: stats ? pctLabel(stats.totalOrders.pctChange) : "+0.0%",
      trend: stats
        ? trendFromPct(stats.totalOrders.pctChange)
        : ("neutral" as const),
      caption: stats ? "vs previous period" : "total in dataset",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((s) => (
        <StatCard
          key={s.title}
          title={s.title}
          amount={s.amount}
          value={s.value}
          percentage={s.percentage}
          trend={s.trend}
          caption={s.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}