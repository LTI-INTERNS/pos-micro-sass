"use client";

import SalesForecastChart from "./SalesForecastChart";
import InsightCard from "../MetricCard";
import { TrendingUp } from "lucide-react";
import SalesInsightsMetrics from "./SalesInsightsMetrics";

export default function ProductAnalysisContent() {
  return (
    <div>
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">

        {/* Chart */}
        <div className="w-full lg:flex-3 min-w-0">
          <SalesForecastChart />
        </div>

        {/* AI Insight Card */}
        <div className="w-full lg:flex-1 min-w-0 flex justify-center items-start lg:items-center">
          <InsightCard
              title="Growth Metrics"
              icon={<TrendingUp size={20} />}
              metrics={[
                  { label: "Predicted Growth", value: "+10.8%" },
                  { label: "Confidence Level", value: "85%" },
              ]}
          />
        </div>
      </div>
      
      <div className="w-full lg:flex-3 min-w-0 pt-5">
        <SalesInsightsMetrics />
      </div>
      

    </div>
  );
}
