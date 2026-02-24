
"use client";

import CustomerReportChart from "./CustomerReportChart";
import StatCardGrid from "./CustomerStatCardGrid"
import PeakVisitDaysCard from "./PeakVisitDaysCard";
import { PEAK_VISIT_DATA } from "./mock";
import InsightCard from "../MetricCard";
import { TrendingUp } from "lucide-react";

export default function StaffAnalysisContent() {
  return (
    <div>
      <div className="flex flex-col md:flex-col lg:flex-row w-full gap-4">

          <div className="w-full lg:flex-3 min-w-0">
            <CustomerReportChart />
          </div>

          <div className="w-full lg:flex-1 min-w-0 flex justify-center items-start lg:items-center">
            <InsightCard
                title="Growth Metrics"
                icon={<TrendingUp size={20} />}
                metrics={[
                    { label: "Predicted Growth", value: "50.4%" },
                    { label: "Confidence Level", value: "99%" },
                ]}
            />
          </div>
        </div>

        <div className="w-full lg:flex-3 min-w-0 pt-5">
           <StatCardGrid />
        </div>
        <div className="w-full min-w-0 pt-5">
          <PeakVisitDaysCard items={PEAK_VISIT_DATA} />
        </div>

     
      </div>
      
      
  );
}
