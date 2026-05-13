"use client";

import React from "react";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

export type MetricCardProps = {
  title: string;
  amount?: number;

  // Main value (big)
  value?: React.ReactNode;

  // Small "current" line under the value
  subtitle?: React.ReactNode;

  // Progress bar (0-100)
  progressPct?: number;

  // Right-side pill (e.g. "+12.4%", "Consistent", "+30 min")
  pillText?: string;
  pillTone?: "orange" | "neutral";

  className?: string;
};

export default function MetricCard({
  title,
  value,
  amount,
  subtitle,
  progressPct = 0,
  pillText,
  pillTone = "orange",
  className = "",
}: MetricCardProps) {
  const { currency, useCents } = useCurrency();
  const pct = clamp(progressPct, 0, 100);

  const displayValue = amount !== undefined
    ? formatCurrency(amount, currency, useCents) 
    : value;

  const pillClasses =
    pillTone === "orange"
      ? "bg-orange-50 text-orange-600"
      : "bg-slate-100 text-slate-600";

  return (
    <div
      className={[
        "rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100",
        className,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
            {displayValue}
          </div>
        </div>

        {pillText ? (
          <span
            className={[
              "mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
              pillClasses,
            ].join(" ")}
          >
            {pillText}
          </span>
        ) : null}
      </div>

      {subtitle ? (
        <div className="mt-3 text-sm text-slate-400">{subtitle}</div>
      ) : (
        <div className="mt-3 h-5" />
      )}

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-orange-500 transition-[width] duration-500"
            style={{ width: `${pct}%` }}
            aria-label="progress"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            role="progressbar"
          />
        </div>
      </div>
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}
