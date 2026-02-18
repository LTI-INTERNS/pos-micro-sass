"use client";

import BranchPerformanceChart from "./BranchPerformanceChart";
import InsightCard from "../MetricCard";
import { TrendingUp } from "lucide-react";

export default function ProductAnalysisContent() {
  return (
    <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">

      {/* Chart */}
      <div className="w-full lg:flex-3 min-w-0">
        <BranchPerformanceChart />
      </div>

      {/* AI Insight Card */}
      <div className="w-full lg:flex-1 min-w-0 flex justify-center items-start lg:items-center">
        <InsightCard
            title="Growth Metrics"
            icon={<TrendingUp size={20} />}
            metrics={[
                { label: "Predicted Growth", value: "+12.4%" },
                { label: "Confidence Level", value: "89%" },
            ]}
        />
      </div>

    </div>
  );
}
