"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { BRANCH_FORECAST_DATA } from "@/app/reports/reportsMockData";

export default function BranchPerformanceChart() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Branch Performance Comparison
        </h2>

        <div className="bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
          Next 2 Months
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={BRANCH_FORECAST_DATA}>
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

            <Bar dataKey="actual" fill="#60a5fa" name="Sales" legendType="circle"/>
            <Bar dataKey="predicted" fill="#fb923c" name="Prediction" legendType="circle"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
