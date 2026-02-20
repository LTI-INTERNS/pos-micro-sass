"use client";

import React from "react";
import ProgressBar from "../AiProgressBar";

type PeakVisitItem = {
  id: string;
  label: string;
  percent: number;
};

type Props = {
  title?: string;
  items: PeakVisitItem[];
};

export default function PeakVisitDaysCard({
  title = "Peak Visit Days (predicted)",
  items,
}: Props) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
      
      {/* Header */}
      <h3 className="text-lg font-semibold text-gray-800 mb-6">
        {title}
      </h3>

      {/* List */}
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4">
            
            {/* Day */}
            <div className="w-28 text-sm text-gray-500">
              {item.label}
            </div>

            {/* Progress */}
            <div className="flex-1">
              <ProgressBar value={item.percent} tone="orange" />
            </div>

            {/* Percentage badge */}
            <span className="min-w-[72px] text-center rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-600">
              +{item.percent}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
