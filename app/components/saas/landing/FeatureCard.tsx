"use client";

import React from "react";

export type FeatureCardProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
  
 
  hoverColor?: string;
  borderColor?: string; 
  hoverBorderColor?: string; 
  iconSize?: string;
  textSize?: string; 
  
 
  padding?: string;
  gap?: string; 
  
  
  showGlowEffect?: boolean; 
  animationDuration?: string; 
};

export default function FeatureCard({
  icon,
  label,
  onClick,
  className = "",
  hoverColor = "orange-400",
  borderColor = "white/10",
  hoverBorderColor = "orange-400/50",
  iconSize = "w-7 h-7",
  textSize = "text-sm sm:text-base",
  padding = "p-5 sm:p-6",
  gap = "gap-4 sm:gap-5",
  showGlowEffect = true,
  animationDuration = "duration-300",
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        "group relative",
        "bg-gradient-to-br from-black/40 via-black/30 to-transparent",
        "backdrop-blur-sm",
        `border border-${borderColor}`,
        `hover:border-${hoverBorderColor}`,
        "hover:shadow-lg hover:shadow-orange-500/20",
        "rounded-xl",
        padding,
        "transition-all",
        animationDuration,
        onClick ? "cursor-pointer" : "",
        className,
      ].join(" ")}
    >
      <div className={["flex items-center", gap].join(" ")}>
        <div
          className={[
            "flex-shrink-0",
            iconSize,
            "text-white",
            `group-hover:text-${hoverColor}`,
            "transition-colors",
            animationDuration,
          ].join(" ")}
        >
          {icon}
        </div>

        <span
          className={[
            "text-white",
            textSize,
            "font-normal",
            "group-hover:text-orange-100",
            "transition-colors",
            animationDuration,
          ].join(" ")}
        >
          {label}
        </span>
      </div>

      {showGlowEffect && (
        <div
          className={[
            "absolute inset-0 rounded-xl",
            "bg-gradient-to-br from-orange-500/0 to-orange-600/0",
            "group-hover:from-orange-500/5 group-hover:to-orange-600/5",
            "transition-all",
            animationDuration,
            "pointer-events-none",
          ].join(" ")}
        />
      )}
    </div>
  );
}
