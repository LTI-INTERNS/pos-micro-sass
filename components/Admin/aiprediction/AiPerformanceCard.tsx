import React from "react";
import ProgressBar from "@/components/Admin/aiprediction/AiProgressBar";

export type PerformanceItem = {
  id: string;
  title: string; // e.g. "Nirmala Azale" / "Acme Corp"
  subtitle?: string; // e.g. "Sales Performance & Productivity"

  // Primary metric (left column)
  primaryMetricLabel: string; // e.g. "Sales" / "Revenue" / "LTV"
  primaryMetricValueText: string; // e.g. "$4,800" (text so you can format however you want)
  primaryMetricSubtext?: string; // e.g. "Target: $5000" or "Plan: Pro"

  // Bars (middle/right)
  metricA: { label: string; valuePct: number; tone?: "orange" | "green" };
  metricB: { label: string; valuePct: number; tone?: "orange" | "green" };

  // Badge (top-right)
  badgeText?: string; // e.g. "96% Productivity"
  badgeTone?: "orange" | "green";

  // Callout
  calloutLabel?: string; // default "AI Prediction"
  calloutText: string;
};

function Badge({
  text,
  tone = "orange",
}: {
  text: string;
  tone?: "orange" | "green";
}) {
  const styles =
    tone === "green"
      ? "bg-green-100 text-green-700"
      : "bg-orange-100 text-orange-700";

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        styles,
      ].join(" ")}
    >
      {text}
    </span>
  );
}

function SparkIcon() {
  return (
    <svg
      className="h-5 w-5 text-orange-600"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 2l1.2 3.6L17 7l-3.8 1.4L12 12l-1.2-3.6L7 7l3.8-1.4L12 2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M5 12l.8 2.4L8 15l-2.2.6L5 18l-.8-2.4L2 15l2.2-.6L5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity=".9"
      />
      <path
        d="M19 12l.8 2.4L22 15l-2.2.6L19 18l-.8-2.4L16 15l2.2-.6L19 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        opacity=".9"
      />
    </svg>
  );
}

function MetricBlock({
  label,
  value,
  subvalue,
}: {
  label: string;
  value: React.ReactNode;
  subvalue?: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
      {subvalue ? <div className="text-sm text-gray-600">{subvalue}</div> : null}
    </div>
  );
}

function BarMetric({
  label,
  percent,
  tone,
}: {
  label: string;
  percent: number;
  tone: "orange" | "green";
}) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">{label}</div>
      <ProgressBar value={percent} tone={tone} />
      <div className="text-lg font-semibold text-gray-900">{percent}%</div>
    </div>
  );
}

export default function PerformanceCard({ item }: { item: PerformanceItem }) {
  const badgeTone =
    item.badgeTone ?? (item.metricA.valuePct >= 100 ? "green" : "orange");

  return (
    <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
  
      <div className="flex flex-col gap-3 sm:block">
        {item.badgeText ? (
          <div className="sm:absolute sm:right-6 sm:top-6">
            <Badge text={item.badgeText} tone={badgeTone} />
          </div>
        ) : null}

       
        <div className="space-y-1 sm:pr-28">
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          {item.subtitle ? (
            <p className="text-sm text-gray-500">{item.subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-3">
        <MetricBlock
          label={item.primaryMetricLabel}
          value={item.primaryMetricValueText}
          subvalue={item.primaryMetricSubtext}
        />

        <BarMetric
          label={item.metricA.label}
          percent={item.metricA.valuePct}
          tone={item.metricA.tone ?? "orange"}
        />

        <BarMetric
          label={item.metricB.label}
          percent={item.metricB.valuePct}
          tone={item.metricB.tone ?? "green"}
        />
      </div>

      <div className="mt-6 rounded-xl bg-orange-50 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-orange-700">
          <SparkIcon />
          {item.calloutLabel ?? "AI Prediction"}
        </div>
        <p className="mt-2 text-sm text-gray-700">{item.calloutText}</p>
      </div>
    </div>
  );
}
