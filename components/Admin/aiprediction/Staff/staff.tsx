"use client";

import PerformancePredictions, { PerformanceItem } from "@/components/Admin/aiprediction/AiPerformancePredictions";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export default function Staff() {
  const { currency, useCents } = useCurrency();

  const staffItems: PerformanceItem[] = [
    {
      id: "staff-1",
      title: "Chamara Perera",
      subtitle: "Sales Performance & Productivity",

      primaryMetricLabel: "Sales",
      primaryMetricValueText: formatCurrency(48000, currency, useCents),
      primaryMetricSubtext: `Target: ${formatCurrency(50000, currency, useCents)}`,

      metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
      metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

      badgeText: "96% Productivity",
      badgeTone: "orange",

      calloutText: "Growth potential identified. Recommend skill development training.",
    },
    {
      id: "staff-2",
      title: "Malith Dilhara",
      subtitle: "Sales Performance & Productivity",

      primaryMetricLabel: "Sales",
      primaryMetricValueText: formatCurrency(52000, currency, useCents),
      primaryMetricSubtext: `Target: ${formatCurrency(60000, currency, useCents)}`,

      metricA: { label: "Productivity", valuePct: 104, tone: "orange" },
      metricB: { label: "Satisfaction", valuePct: 99, tone: "green" },

      badgeText: "104% Productivity",
      badgeTone: "green",

      calloutText: "Strong performer. Expected to increase sales by 15–20% next quarter.",
    },
    {
      id: "staff-3",
      title: "Malsha Ashen",
      subtitle: "Sales Performance & Productivity",

      primaryMetricLabel: "Sales",
      primaryMetricValueText: formatCurrency(22000, currency, useCents),
      primaryMetricSubtext: `Target: ${formatCurrency(30000, currency, useCents)}`,

      metricA: { label: "Productivity", valuePct: 91, tone: "orange" },
      metricB: { label: "Satisfaction", valuePct: 99, tone: "green" },

      badgeText: "91% Productivity",
      badgeTone: "orange",

      calloutText: "Growth potential identified. Recommend skill development training.",
    },
    {
      id: "staff-4",
      title: "Manuga Dewhan",
      subtitle: "Sales Performance & Productivity",

      primaryMetricLabel: "Sales",
      primaryMetricValueText: formatCurrency(28000, currency, useCents),
      primaryMetricSubtext: `Target: ${formatCurrency(10000, currency, useCents)}`,

      metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
      metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

      badgeText: "96% Productivity",
      badgeTone: "orange",

      calloutText: "Growth potential identified. Recommend skill development training.",
    },
    {
      id: "staff-5",
      title: "Kavindu Madhushan",
      subtitle: "Sales Performance & Productivity",

      primaryMetricLabel: "Sales",
      primaryMetricValueText: formatCurrency(78000, currency, useCents),
      primaryMetricSubtext: `Target: ${formatCurrency(64000, currency, useCents)}`,

      metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
      metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

      badgeText: "96% Productivity",
      badgeTone: "orange",

      calloutText: "Growth potential identified. Recommend skill development training.",
    },
  ];


  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full">
        <PerformancePredictions title="Staff Performance Predictions" items={staffItems} />
      </div>
    </main>
  );
}
