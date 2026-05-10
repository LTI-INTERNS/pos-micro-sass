"use client";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { ForecastPoint } from "@/types/ai-insight.types";

type TooltipPayload = { name: string; value: number };
type CustomTooltipProps = { active?: boolean; payload?: TooltipPayload[] };

const TooltipBox = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white rounded-xl px-4 py-3 text-xs shadow-lg">
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-6">
          <span>{p.name}</span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

type Props = { data?: ForecastPoint[] };

export default function CustomerGrowthChart({ data }: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">Customer Growth Prediction</h3>
        <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">Past 4 Weeks / Next 4 Weeks</span>
      </div>
      <div className="h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#b3b3b3" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#b3b3b3" }} axisLine={false} tickLine={false} />
            <Tooltip content={<TooltipBox />} />
            <Line type="monotone" dataKey="actual"    stroke="#6366f1" strokeWidth={3} name="Actual Customers" connectNulls />
            <Line type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={3} strokeDasharray="5 5" name="Predicted Customers" connectNulls />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}