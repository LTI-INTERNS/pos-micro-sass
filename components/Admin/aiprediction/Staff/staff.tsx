"use client";

import PerformancePredictions from "@/components/Admin/aiprediction/AiPerformancePredictions";
import type { PerformanceItem } from "@/components/Admin/aiprediction/AiPerformancePredictions";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import type { StaffCashierItem } from "@/types/ai-insight.types";

type Props = { cashiers?: StaffCashierItem[] };

export default function Staff({ cashiers }: Props) {
  const { currency, useCents } = useCurrency();

  const staffItems: PerformanceItem[] = cashiers && cashiers.length > 0
    ? cashiers.map((c) => ({
        id:    c.id,
        title: c.name,
        subtitle: `${c.branchName} · Sales Performance & Productivity`,

        primaryMetricLabel:    "Sales",
        primaryMetricValueText: formatCurrency(c.revenue, currency, useCents),
        primaryMetricSubtext:  `${c.orderCount} orders (avg ${formatCurrency(c.avgOrderValue, currency, useCents)})`,

        metricA: { label: "Productivity", valuePct: c.productivityPct, tone: "orange" as const },
        metricB: { label: "Efficiency",   valuePct: c.efficiencyPct,   tone: "green"  as const },

        badgeText: c.badgeText,
        badgeTone: c.badgeTone,

        calloutText: c.aiCallout,
      }))
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full">
        <PerformancePredictions title="Staff Performance Predictions" items={staffItems} />
      </div>
    </main>
  );
}
