"use client";

import React from "react";
import MetricGrid from "@/components/Admin/aiprediction/Sales/MetricGrid";
import type { MetricCardProps } from "@/components/Admin/aiprediction/Sales/MetricCard";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import type { SalesMetricItem } from "@/types/ai-insight.types";

export type SalesInsightsMetricsProps = {
  className?: string;
  items?: SalesMetricItem[];
};

export default function SalesInsightsMetrics({
  className = "",
  items,
}: SalesInsightsMetricsProps) {
  const { currency, useCents } = useCurrency();

  // Only render if real AI data was passed — no fallback to mock values
  if (!items || items.length === 0) return null;

  const mapped: MetricCardProps[] = items.map((item) => ({
    title:       item.title,
    amount:      item.amount,
    value:       item.value,
    progressPct: item.progressPct,
    pillText:    item.pillText,
    pillTone:    "orange",
    subtitle: item.subtitle ? (
      <>
        <span className="text-slate-400">Current: </span>
        <span className="text-slate-500">{item.subtitle}</span>
      </>
    ) : item.amount !== undefined ? (
      <>
        <span className="text-slate-400">Current: </span>
        <span className="text-slate-500">
          {formatCurrency(item.amount, currency, useCents)}
        </span>
      </>
    ) : undefined,
  }));

  return (
    <section className={className}>
      <MetricGrid items={mapped} />
    </section>
  );
}
