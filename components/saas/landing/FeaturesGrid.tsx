"use client";

import React from "react";
import FeatureCard, { FeatureCardProps } from "./FeatureCard";

export type Feature = {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

export type FeaturesGridProps = {
  features: Feature[];

  columns?: {
    mobile?: number;
    sm?: number;
    lg?: number;
    xl?: number;
    "2xl"?: number;
  };

  gap?: string;
  maxWidth?: string;

  cardProps?: Partial<FeatureCardProps>;

  className?: string;
};

const COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

const SM_COLS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-4",
  5: "sm:grid-cols-5",
  6: "sm:grid-cols-6",
};

const LG_COLS: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
};

const XL_COLS: Record<number, string> = {
  1: "xl:grid-cols-1",
  2: "xl:grid-cols-2",
  3: "xl:grid-cols-3",
  4: "xl:grid-cols-4",
  5: "xl:grid-cols-5",
  6: "xl:grid-cols-6",
};

const XXL_COLS: Record<number, string> = {
  1: "2xl:grid-cols-1",
  2: "2xl:grid-cols-2",
  3: "2xl:grid-cols-3",
  4: "2xl:grid-cols-4",
  5: "2xl:grid-cols-5",
  6: "2xl:grid-cols-6",
};

function clampCols(n: unknown, fallback: number) {
  const num = typeof n === "number" ? n : Number(n);
  if (Number.isNaN(num)) return fallback;
  return Math.min(6, Math.max(1, num));
}

export default function FeaturesGrid({
  features,
  columns = {},
  gap = "gap-4",
  maxWidth = "max-w-none",
  cardProps = {},
  className = "",
}: FeaturesGridProps) {
  const mobile = clampCols(columns.mobile, 1);
  const sm = clampCols(columns.sm, 2);
  const lg = clampCols(columns.lg, 3);
  const xl = clampCols(columns.xl, 4);
  const xxl = clampCols(columns["2xl"], 4); // ✅ default 4 on 2xl

  const gridClasses = [
    "grid w-full",
    COLS[mobile],
    SM_COLS[sm],
    LG_COLS[lg],
    XL_COLS[xl],
    XXL_COLS[xxl], // ✅ always valid now, no wrong fallback
    gap,
    maxWidth,
    className,
  ].join(" ");

  return (
    <div className={gridClasses}>
      {features.map((feature) => (
        <div key={feature.id} className="min-w-0">
          <FeatureCard
            icon={feature.icon}
            label={feature.label}
            onClick={feature.onClick}
            {...cardProps}
          />
        </div>
      ))}
    </div>
  );
}