"use client";

import React from "react";
import SectionHeader, { SectionHeaderProps } from "./SectionHeader";
import FeaturesGrid, { FeaturesGridProps, Feature } from "./FeaturesGrid";

export type FeaturesSectionProps = {
  title: string;
  subtitle?: string;
  headerProps?: Partial<SectionHeaderProps>;
  
  features: Feature[];
  gridProps?: Partial<FeaturesGridProps>;
  
  backgroundImage?: string;
  backgroundColor?: string;
  backgroundGradient?: string;
  
  padding?: string; 
  maxWidth?: string;
  
  containerClassName?: string;
  sectionClassName?: string;
};

export default function FeaturesSection({
  title,
  subtitle,
  headerProps = {},
  features,
  gridProps = {},
  backgroundImage,
  backgroundColor,
  backgroundGradient,
  padding = "px-4 sm:px-6 lg:px-20 py-12 sm:py-16 lg:py-20",
  maxWidth = "max-w-7xl",
  containerClassName = "",
  sectionClassName = "",
}: FeaturesSectionProps) {
  const backgroundStyle: React.CSSProperties = {};
  
  if (backgroundImage) {
    backgroundStyle.backgroundImage = `url('${backgroundImage}')`;
  } else if (backgroundGradient) {
    backgroundStyle.background = backgroundGradient;
  } else if (backgroundColor) {
    backgroundStyle.backgroundColor = backgroundColor;
  }

  return (
    <div
      className={[
        "min-h-screen w-full bg-cover bg-center bg-no-repeat",
        containerClassName,
      ].join(" ")}
      style={backgroundStyle}
    >
      <section className={["w-full", padding, sectionClassName].join(" ")}>
        <div className={["mx-auto", maxWidth].join(" ")}>
          <SectionHeader
            title={title}
            subtitle={subtitle}
            {...headerProps}
          />

          <FeaturesGrid
            features={features}
            {...gridProps}
          />
        </div>
      </section>
    </div>
  );
}
