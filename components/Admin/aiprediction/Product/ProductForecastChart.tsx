"use client";

import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from "recharts";
import type { ForecastPoint } from "@/types/ai-insight.types";

type Props = { data?: ForecastPoint[] };

export default function ProductForecastChart({ data }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Product Demand Forecast</h2>
        <div className="bg-orange-100 text-orange-600 text-sm px-4 py-1 rounded-full">
          Past 4 Weeks / Next 4 Weeks
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip contentStyle={{ backgroundColor: "#000", border: "none", borderRadius: "8px" }} />
            <Legend />
            <Line type="monotone" dataKey="actual"    stroke="#6366f1" strokeWidth={3} name="Actual" connectNulls />
            <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeDasharray="5 5" strokeWidth={3} name="Predicted" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
