"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { BranchDistributionItem } from "@/types/ai-insight.types";

type Props = { data?: BranchDistributionItem[] };

export default function CustomerBranchChart({ data }: Props) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-800">Customer Distribution by Branch</h3>
        <span className="bg-orange-100 text-orange-600 text-xs px-3 py-1 rounded-full">Total Customers</span>
      </div>
      <div className="h-[280px] min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data ?? []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branchName" tick={{ fontSize: 11, fill: "#b3b3b3" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#b3b3b3" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ backgroundColor: "#000", borderRadius: "8px", border: "none", fontSize: "12px", color: "#fff" }} />
            <Bar dataKey="customerCount" fill="#fb923c" name="Total Customers" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
