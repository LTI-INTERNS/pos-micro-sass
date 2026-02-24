import React from "react";
import MetricCard, { MetricCardProps } from "@/components/Admin/aiprediction/Sales/MetricCard";

export type MetricGridProps = {
  items: MetricCardProps[];
  className?: string;
};

export default function MetricGrid({ items, className = "" }: MetricGridProps) {
  return (
    <div
      className={[
        "grid grid-cols-1 gap-6 md:grid-cols-2",
        className,
      ].join(" ")}
    >
      {items.map((item, idx) => (
        <MetricCard key={idx} {...item} />
      ))}
    </div>
  );
}
