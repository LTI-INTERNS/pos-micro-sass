"use client";

import React from "react";

export type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  
  align?: "left" | "center" | "right"; 
  
  titleSize?: string; 
  subtitleSize?: string; 
  titleColor?: string; 
  subtitleColor?: string; 
  
  spacing?: string;
  marginBottom?: string;
  maxWidth?: string;
  
  
  titleWeight?: string; 
  subtitleWeight?: string;
  className?: string;
  children?: React.ReactNode;
};

export default function SectionHeader({
  title,
  subtitle,
  align = "center",
  titleSize = "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
  subtitleSize = "text-sm sm:text-base lg:text-lg",
  titleColor = "text-white",
  subtitleColor = "text-white/90",
  spacing = "space-y-4 sm:space-y-6",
  marginBottom = "mb-12 sm:mb-16 lg:mb-20",
  maxWidth = "max-w-4xl",
  titleWeight = "font-semibold",
  subtitleWeight = "font-normal",
  className = "",
  children,
}: SectionHeaderProps) {
  const alignMap = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const alignClass = alignMap[align];

  return (
    <div
      className={[
        alignClass,
        marginBottom,
        spacing,
        className,
      ].join(" ")}
    >
      <h1
        className={[
          titleColor,
          titleSize,
          titleWeight,
          "px-4",
        ].join(" ")}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={[
            subtitleColor,
            subtitleSize,
            subtitleWeight,
            maxWidth,
            "mx-auto px-4 leading-relaxed",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}

      {children}
    </div>
  );
}
