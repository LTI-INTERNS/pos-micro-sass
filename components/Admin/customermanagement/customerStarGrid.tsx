"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatCard from "@/components/Admin/common/StatCard";
import { customerService, type CustomerStats } from "@/lib/services/customer-service";

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct + "%";
}

export default function StatCardGrid() {
  const { data: session, status } = useSession();
  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [stats, setStats]     = useState<CustomerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    customerService
      .getStats(canSeeAllBranches ? undefined : branchId)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [status, branchId, canSeeAllBranches]);

  const newVal   = loading ? "—" : String(stats?.newThisMonth.value  ?? 0);
  const totalVal = loading ? "—" : String(stats?.total.value         ?? 0);

  const newPct   = stats?.newThisMonth.pctChange  ?? 0;
  const totalPct = stats?.total.pctChange          ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard
        title="New Customers"
        value={newVal}
        percentage={loading ? "" : formatPct(newPct)}
        trend={newPct >= 0 ? "up" : "down"}
        caption="vs last month"
        showDetailButton={false}
      />
      <StatCard
        title="Customers"
        value={totalVal}
        percentage={loading ? "" : formatPct(totalPct)}
        trend={totalPct >= 0 ? "up" : "down"}
        caption="vs last month"
        showDetailButton={false}
      />
    </div>
  );
}
