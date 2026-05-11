"use client";

import React from "react";
import SectionHeader, { SectionHeaderProps } from "@/components/saas/landing/SectionHeader";
import FeaturesGrid, { FeaturesGridProps, Feature } from "@/components/saas/landing/FeaturesGrid";

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

  // ✅ keep px-28 on large/4K
  padding = "px-4 sm:px-6 lg:px-28 2xl:px-28 py-12 sm:py-16 lg:py-20",

  // ✅ IMPORTANT: remove max width limitation completely
  // so the content can use the entire available width (minus px-28)
  maxWidth = "max-w-none",

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
        "relative w-full py-16 sm:py-20 md:py-24 bg-cover bg-center bg-no-repeat",
        containerClassName,
      ].join(" ")}
      style={backgroundStyle}
    >
      <section className={["w-full", padding, sectionClassName].join(" ")}>
        <div className={["mx-auto w-full", maxWidth].join(" ")}>
          <SectionHeader title={title} subtitle={subtitle} {...headerProps} />
          <FeaturesGrid features={features} {...gridProps} />
        </div>
      </section>
    </div>
  );
}