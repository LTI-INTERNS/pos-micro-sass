"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { PRODUCT_FORECAST_DATA } from "@/app/reports/reportsMockData";

export default function ProductForecastChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          Product Demand Forecast
        </h2>

        <div className="bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
          Next 2 Months
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={PRODUCT_FORECAST_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip 
              contentStyle={{
              backgroundColor: '#000',
              border: 'none',
              borderRadius: '8px',
            }}
            />
            <Legend />

            <Line
              type="monotone"
              dataKey="actual"
              stroke="#6366f1"
              strokeWidth={3}
              name="Actual"
            />

            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#f97316"
              strokeDasharray="5 5"
              strokeWidth={3}
              name="Predicted"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
