"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { BRANCH_FORECAST_DATA } from "@/app/reports/reportsMockData";

export default function CustomerBranchChart() {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">
          Customer Distribution by Branch
        </h3>

        <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">
          Current + Forecast
        </span>
      </div>

      <div className="h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={BRANCH_FORECAST_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#b3b3b3" }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{ fontSize: 11, fill: "#b3b3b3" }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#000",
                borderRadius: "8px",
                border: "none",
                fontSize: "12px",
              }}
            />

            <Bar
              dataKey="actual"
              fill="#60a5fa"
              name="Current Customers"
              radius={[4, 4, 0, 0]}
            />

            <Bar
              dataKey="predicted"
              fill="#fb923c"
              name="Predicted Customers"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
