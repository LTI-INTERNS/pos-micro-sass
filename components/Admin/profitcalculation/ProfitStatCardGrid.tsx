"use client";

import StatCard from "@/components/Admin/common/StatCard";
import type { ProfitSummary } from "@/types/analytics.types";

function formatPct(pct: number): string {
  return (pct >= 0 ? "+" : "") + pct.toFixed(1) + "%";
}

type Props = {
  summary?: ProfitSummary;
  loading?: boolean;
};

export default function ProfitStatCardGrid({ summary, loading = false }: Props) {
  if (loading || !summary) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {["Total Revenue", "Total COGS", "Gross Profit", "Avg Margin"].map((title) => (
          <StatCard
            key={title}
            title={title}
            value="—"
            percentage=""
            trend="up"
            caption="vs previous period"
            showDetailButton={false}
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title:   "Total Revenue",
      amount:  summary.totalRevenue.value,
      pct:     summary.totalRevenue.pctChange,
      caption: "vs previous period",
    },
    {
      title:   "Total COGS",
      amount:  summary.totalCogs.value,
      pct:     summary.totalCogs.pctChange,
      // Higher COGS is bad, so invert the trend colour
      invert:  true,
      caption: "cost of goods sold",
    },
    {
      title:   "Gross Profit",
      amount:  summary.grossProfit.value,
      pct:     summary.grossProfit.pctChange,
      caption: "vs previous period",
    },
    {
      title:   "Avg Margin",
      value:   summary.avgMarginPct.value.toFixed(1) + "%",
      pct:     summary.avgMarginPct.pctChange,
      caption: "vs previous period",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {cards.map((card) => {
        const raw   = card.invert ? -card.pct! : card.pct!;
        const trend = raw >= 0 ? "up" : "down";

        return (
          <StatCard
            key={card.title}
            title={card.title}
            {...(card.amount !== undefined ? { amount: card.amount } : { value: card.value })}
            percentage={formatPct(card.pct!)}
            trend={trend}
            caption={card.caption}
            showDetailButton={false}
          />
        );
      })}
    </div>
  );
}
