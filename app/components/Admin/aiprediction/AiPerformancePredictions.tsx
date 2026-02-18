import React from "react";
import PerformanceCard, { PerformanceItem } from "./AiPerformanceCard";

type Props = {
  title?: string;
  items: PerformanceItem[];
  className?: string;
  listHeightClassName?: string;
};

export default function PerformancePredictions({
  title = "Performance Predictions",
  items,
  className,
  listHeightClassName = "max-h-[100vh]",
}: Props) {
  return (
    <section
      className={[
        "rounded-xl border border-gray-200 bg-white p-6 shadow-sm",
        className ?? "",
      ].join(" ")}
    >
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>

      <div
        className={[
          "mt-5 space-y-5",
          listHeightClassName,
          "overflow-y-auto scroll-smooth pr-2",
          "snap-y snap-mandatory",
          "scrollbar-hide", 
        ].join(" ")}
      >
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <PerformanceCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

export type { PerformanceItem };
