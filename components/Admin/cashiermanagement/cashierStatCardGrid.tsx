"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatCard from "@/components/Admin/common/StatCard";
import { cashierService, type CashierStats } from "@/lib/services/cashier-service";

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct + "%";
}

export default function CashierStatCardGrid() {
  const { data: session, status } = useSession();
  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";

  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [stats, setStats]     = useState<CashierStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    cashierService
      .getStats(canSeeAllBranches ? undefined : branchId)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches]);

  const newVal   = loading ? "—" : String(stats?.newThisMonth.value ?? 0);
  const totalVal = loading ? "—" : String(stats?.total.value        ?? 0);

  const newPct   = stats?.newThisMonth.pctChange ?? 0;
  const totalPct = stats?.total.pctChange        ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="New Cashiers"
        value={newVal}
        percentage={loading ? "" : formatPct(newPct)}
        trend={newPct >= 0 ? "up" : "down"}
        caption="vs last month"
        showDetailButton={false}
      />
      <StatCard
        title="Cashiers"
        value={totalVal}
        percentage={loading ? "" : formatPct(totalPct)}
        trend={totalPct >= 0 ? "up" : "down"}
        caption="vs last month"
        showDetailButton={false}
      />
    </div>
  );
}