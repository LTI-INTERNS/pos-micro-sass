// components/SalesInsightsMetrics.tsx
import React from "react";
import MetricGrid from "./MetricGrid";
import type { MetricCardProps } from "./MetricCard";

export type SalesInsightsMetricsProps = {
  className?: string;

  // Optional override: if you want to feed items from API later
  items?: MetricCardProps[];
};

export default function SalesInsightsMetrics({
  className = "",
  items,
}: SalesInsightsMetricsProps) {
  const defaultItems: MetricCardProps[] = [
    {
      title: "Daily Average Sales",
      value: "$1,290",
      subtitle: (
        <>
          <span className="text-slate-400">Current Sale :</span>{" "}
          <span className="text-slate-500">$1,290</span>
        </>
      ),
      progressPct: 92,
      pillText: "+12.4%",
      pillTone: "orange",
    },
    {
      title: "Peak Sales Time",
      value: "5:30 PM – 8:30 PM",
      subtitle: (
        <>
          <span className="text-slate-400">Current :</span>{" "}
          <span className="text-slate-500">6:00 PM – 8:00 PM</span>
        </>
      ),
      progressPct: 90,
      pillText: "+30 min",
      pillTone: "orange",
    },
    {
      title: "Best Performing Day",
      value: "Saturday & Sunday",
      subtitle: (
        <>
          <span className="text-slate-400">Current :</span>{" "}
          <span className="text-slate-500">Saturday</span>
        </>
      ),
      progressPct: 93,
      pillText: "Consistent",
      pillTone: "orange",
    },
    {
      title: "Growth Rate",
      value: "8.2%",
      subtitle: (
        <>
          <span className="text-slate-400">Current :</span>{" "}
          <span className="text-slate-500">6.5%</span>
        </>
      ),
      progressPct: 94,
      pillText: "+1.7%",
      pillTone: "orange",
    },
  ];

  return (
    <section className={className}>
      <MetricGrid items={items ?? defaultItems} />
    </section>
  );
}
