"use client";

import { ReactNode } from "react";
import { RefreshCcw } from "lucide-react";

type Metric = {
  label: string;
  value: string;
  size?: "large" | "small";
};

type InsightCardProps = {
  title: string;
  icon: ReactNode;
  metrics: Metric[];
  buttonText?: string;
  onReanalyze?: () => void;
};

export default function InsightCard({
  title,
  icon,
  metrics,
  buttonText = "Re-analyze",
  onReanalyze,
}: InsightCardProps) {
  return (
    <div className="bg-[#dcc7b7] rounded-2xl p-6 w-full max-w-xs shadow-sm">

      
      <div className="flex items-center gap-2 mb-6">
        <div className="text-orange-500">{icon}</div>
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      </div>

      
      <div className="space-y-4">
          {metrics.map((m, i) => (
            <div key={i} className="bg-gray-200 rounded-xl p-4 ">
              <p className="text-gray-500 text-sm">{m.label}</p>

              <p
                className={`mt-1 font-bold ${
                  m.size === "small"
                    ? "text-base text-gray-800"
                    : "text-3xl text-orange-600"
                }`}
              >
                {m.value}
              </p>
            </div>
          ))}
       </div>


      
      <button
        onClick={onReanalyze}
        className="mt-6 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-lg font-medium transition"
      >
        <RefreshCcw size={16} />
        {buttonText}
      </button>
    </div>
  );
}
