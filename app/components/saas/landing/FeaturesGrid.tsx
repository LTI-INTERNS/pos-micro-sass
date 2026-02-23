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

export default function FeaturesGrid({
  features,
  columns = {},
  gap = "gap-4",
  maxWidth = "max-w-none",
  cardProps = {},
  className = "",
}: FeaturesGridProps) {
  const { mobile = 1, sm = 2, lg = 3, xl = 4, "2xl": xxl = 6 } = columns;

  const gridClasses = [
    "grid w-full",
    COLS[mobile] ?? "grid-cols-1",
    SM_COLS[sm] ?? "sm:grid-cols-2",
    LG_COLS[lg] ?? "lg:grid-cols-3",
    XL_COLS[xl] ?? "xl:grid-cols-4",
    XXL_COLS[xxl] ?? "2xl:grid-cols-6",
    gap,
    maxWidth,
    className,
  ].join(" ");

  return (
    <div className={gridClasses}>
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          icon={feature.icon}
          label={feature.label}
          onClick={feature.onClick}
          {...cardProps}
        />
      ))}
    </div>
  );
}