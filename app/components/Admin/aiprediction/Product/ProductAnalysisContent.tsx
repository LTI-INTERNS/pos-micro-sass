"use client";

import ProductForecastChart from "./ProductForecastChart";
import InsightCard from "../MetricCard";
import { Brain } from "lucide-react";

export default function ProductAnalysisContent() {
  return (
    <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">

      {/* Chart */}
      <div className="w-full lg:flex-3 min-w-0">
        <ProductForecastChart />
      </div>

      {/* AI Insight Card */}
      <div className="w-full lg:flex-1 min-w-0 flex justify-center items-start lg:items-center">
        <InsightCard
          title="AI Insight"
          icon={<Brain size={20} />}
          metrics={[
            { label: "Confidence Level", value: "92%", size: "large" },
            { label: "Analysis Type", value: "Time Series Forecast", size: "small" },
          ]}
        />
      </div>

    </div>
  );
}
