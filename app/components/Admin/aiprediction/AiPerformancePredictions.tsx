import React from "react";
import PerformanceCard, { PerformanceItem } from "./AiPerformanceCard";

type Props = {
  title?: string;
  items: PerformanceItem[];
  className?: string;
};

export default function PerformancePredictions({
  title = "Performance Predictions",
  items,
  className,
}: Props) {
  return (
    <section
      className={[
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <div className="mt-5 space-y-5">
        {items.map((item) => (
          <PerformanceCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export type { PerformanceItem };
