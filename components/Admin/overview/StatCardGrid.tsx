"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import StatCard from "@/components/Admin/common/StatCard";
import { analyticsService } from "@/lib/services";
import { customerService } from "@/lib/services/customer-service";
import { orderService } from "@/lib/services";
import type { CustomerStats } from "@/lib/services/customer-service";
import type { OrderStats } from "@/types/order.types";

type StatCardData = {
  title: string;
  value?: string;
  amount?: number;
  percentage: string;
  trend: "up" | "down";
  caption: string;
};

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

export default function StatCardGrid() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const role     = session?.user?.role     ?? "";
  const branchId = session?.user?.branchId ?? "";
  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  const [baseStats, setBaseStats]         = useState<StatCardData[]>([]);

  const [customerStats, setCustomerStats] = useState<CustomerStats | null>(null);
  const [orderStats, setOrderStats]       = useState<OrderStats | null>(null);
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    analyticsService.getStats().then(setBaseStats);
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;

    const branchParam = canSeeAllBranches ? undefined : branchId;

    setLoading(true);
    Promise.all([
      customerService.getStats(branchParam).catch(() => null),
      orderService.getStats(branchParam).catch(() => null),
    ]).then(([cStats, oStats]) => {
      setCustomerStats(cStats);
      setOrderStats(oStats);
      setLoading(false);
    });
  }, [status, branchId, canSeeAllBranches]);

  const handleDetailClick = (title: string) => {
    const routeMap: Record<string, string> = {
      Customers: "/customermanagement",
      "Low Stock Products": "/productmanagement",
      "Total Sales": "/reports",
      Expenses: "/expensesmanagement",
    };
    const route = routeMap[title];
    if (route) router.push(route);
  };

  const cards: StatCardData[] = baseStats.map((card) => {
    if (card.title === "Customers") {
      const pct = customerStats?.total.pctChange ?? 0;
      return {
        title:      "Customers",
        value:      loading ? "—" : String(customerStats?.total.value ?? 0),
        percentage: loading ? "" : formatPct(pct),
        trend:      pct >= 0 ? "up" : "down",
        caption:    "vs last month",
      };
    }

    if (card.title === "Total Sales") {
      const pct = orderStats?.totalRevenue.pctChange ?? 0;
      return {
        title:      "Total Sales",
        amount:     loading ? undefined : (orderStats?.totalRevenue.value ?? 0),
        percentage: loading ? "" : formatPct(pct),
        trend:      pct >= 0 ? "up" : "down",
        caption:    "vs last month",
      };
    }

    return card;
  });

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