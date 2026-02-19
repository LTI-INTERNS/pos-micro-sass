"use client";

import React from "react";
import { Check } from "lucide-react";

export type PlanFeature = {
  label: string;
  value: string;
};

export type PlanCardProps = {
  name: string;
  price?: string;
  billingCycle?: string;
  description?: string;
  features: PlanFeature[];
  isCurrent?: boolean;
  badge?: string;
  onUpgrade?: () => void;
  upgradeLabel?: string;
  className?: string;
};

export default function PlanCard({
  name,
  price,
  billingCycle,
  description,
  features,
  isCurrent = false,
  badge,
  onUpgrade,
  upgradeLabel = "Upgrade to this plan",
  className = "",
}: PlanCardProps) {
  return (
    <div
      className={[
        "relative bg-white rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200",
        isCurrent
          ? "border-2 border-orange-400 shadow-md"
          : "border border-gray-200 shadow-sm hover:shadow-md",
        className,
      ].join(" ")}
    >
      {(badge || isCurrent) && (
        <span
          className={[
            "absolute top-5 right-5 text-xs font-semibold px-3 py-1 rounded-full",
            isCurrent
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-500",
          ].join(" ")}
        >
          {isCurrent ? "Current Plan" : badge}
        </span>
      )}

      <div className="flex flex-col gap-1 pr-28">
        <h2 className="text-lg font-bold text-gray-900">{name}</h2>

        {(price || billingCycle) && (
          <div className="flex items-baseline gap-1.5 mt-0.5">
            {price && (
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
                {price}
              </span>
            )}
            {billingCycle && (
              <span className="text-sm font-normal text-gray-400">
                / {billingCycle}
              </span>
            )}
          </div>
        )}

        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
      </div>

      <div className="w-full h-px bg-gray-100" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
        {features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Check size={9} strokeWidth={2.5} className="text-orange-500" />
            </span>

            <p className="text-xs text-gray-400">
              {f.label}:{" "}
              <span className="font-bold text-gray-900">{f.value}</span>
            </p>
          </div>
        ))}
      </div>

      {!isCurrent && onUpgrade && (
        <div className="pt-0.5">
          <button
            onClick={onUpgrade}
            className="
              bg-orange-500 hover:bg-orange-600
              text-white text-xs font-semibold
              px-6 py-2.5 rounded-full
              transition-all duration-150 active:scale-95 cursor-pointer
            "
          >
            {upgradeLabel}
          </button>
        </div>
      )}

      {isCurrent && (
        <div className="pt-0.5">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-50 border border-orange-200">
            <Check size={11} strokeWidth={2.5} className="text-orange-500" />
            <span className="text-xs font-semibold text-orange-500">
              Your active plan
            </span>
          </div>
        </div>
      )}
    </div>
  );
}