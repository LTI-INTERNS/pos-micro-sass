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
  };
  
  gap?: string;
  maxWidth?: string;
  
  cardProps?: Partial<FeatureCardProps>;
  
  className?: string;
};

export default function FeaturesGrid({
  features,
  columns = {},
  gap = "gap-2",
  maxWidth = "max-w-6xl",
  cardProps = {},
  className = "",
}: FeaturesGridProps) {
  const {
    mobile = 1,
    sm = 2,
    lg = 3,
    xl = 4,
  } = columns;

  const gridClasses = [
    "grid",
    `grid-cols-${mobile}`,
    `sm:grid-cols-${sm}`,
    `lg:grid-cols-${lg}`,
    `xl:grid-cols-${xl}`,
    gap,
    maxWidth,
    "mx-auto",
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
