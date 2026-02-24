"use client";

import BranchPerformanceChart from "./BranchPerformanceChart";
import InsightCard from "../MetricCard";
import BranchForecastCard from "./BranchForecastCard";
import { mockBranchData } from "./mockBranchData";
import { TrendingUp } from "lucide-react";

export default function ProductAnalysisContent() {
  return (
    <div>
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">

        <div className="w-full lg:flex-3 min-w-0">
          <BranchPerformanceChart />
        </div>

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
      
      <div className="pt-5">
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Branch Forecast Overview
          </h3>

          <BranchForecastCard branches={mockBranchData} />
        </div>
      </div>
    </div>
  );
}
