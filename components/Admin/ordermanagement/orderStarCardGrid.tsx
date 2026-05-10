"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/Admin/common/StatCard";
import { orderService } from "@/lib/services";
import { queryKeys } from "@/lib/query-keys";
import type { OrderStats } from "@/types/order.types";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

function pctTrend(pct: number): "up" | "down" {
  return pct >= 0 ? "up" : "down";
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function OrderStatCardGrid() {
  const { data: session, status } = useSession();

  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";

  /**
   * OWNER / ADMIN  → no branchId → backend returns company-wide stats.
   * MANAGER        → branchId   → backend scopes to their branch.
   */
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";
  const effectiveBranchId = canSeeAllBranches ? undefined : branchId;

  const statsQuery = useQuery<OrderStats>({
    queryKey: queryKeys.orders.stats(effectiveBranchId),
    queryFn: () => orderService.getStats(effectiveBranchId),
    enabled: status === "authenticated",
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
  const stats = statsQuery.data ?? null;
  const loading = statsQuery.isLoading;

  // Derive display values — show "—" while loading, "0" on error
  const val = (n?: number) => (loading ? "—" : String(n ?? 0));
  const pct = (n?: number) => (loading || n === undefined ? "" : formatPct(n));
  const trend = (n?: number): "up" | "down" =>
    loading || n === undefined ? "up" : pctTrend(n);

  const cards = [
    {
      title:   "Total Orders",
      value:   val(stats?.totalOrders.value),
      pct:     pct(stats?.totalOrders.pctChange),
      trend:   trend(stats?.totalOrders.pctChange),
      caption: "vs last month",
      amount:  undefined as number | undefined,
    },
    {
      title:   "Total Revenue",
      value:   undefined as string | undefined,
      amount:  loading ? undefined : (stats?.totalRevenue.value ?? 0),
      pct:     pct(stats?.totalRevenue.pctChange),
      trend:   trend(stats?.totalRevenue.pctChange),
      caption: "vs last month",
    },
    {
      title:   "Completed Orders",
      value:   val(stats?.completedOrders.value),
      pct:     pct(stats?.completedOrders.pctChange),
      trend:   trend(stats?.completedOrders.pctChange),
      caption: "vs last month",
      amount:  undefined as number | undefined,
    },
    {
      title:   "Canceled Orders",
      value:   val(stats?.canceledOrders.value),
      pct:     pct(stats?.canceledOrders.pctChange),
      // Fewer cancellations is good → flip the colour for display
      trend:   trend(-(stats?.canceledOrders.pctChange ?? 0)),
      caption: "vs last month",
      amount:  undefined as number | undefined,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <StatCard
          key={card.title}
          title={card.title}
          value={card.value}
          amount={card.amount}
          percentage={card.pct}
          trend={card.trend}
          caption={card.caption}
          showDetailButton={false}
        />
      ))}
    </div>
  );
}