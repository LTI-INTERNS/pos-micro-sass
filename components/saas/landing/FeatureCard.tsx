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

  // ✅ ensure same card height
  minHeight?: string;

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

  iconSize = "w-7 h-7 lg:w-8 lg:h-8 2xl:w-10 2xl:h-10",
  textSize = "text-sm sm:text-base lg:text-lg 2xl:text-xl",
  padding = "p-5 sm:p-6 lg:p-7 2xl:p-8",
  gap = "gap-4 sm:gap-5 lg:gap-6 2xl:gap-7",

  // ✅ consistent height across cards (fixes uneven buttons)
  minHeight = "h-[72px] sm:min-h-[76px] lg:min-h-[84px] 2xl:min-h-[96px]",

  showGlowEffect = true,
  animationDuration = "duration-300",
}: FeatureCardProps) {
  // ✅ Force responsive sizing even if icon passed with fixed w/h classes
  let renderedIcon: React.ReactNode = icon;

  if (React.isValidElement(icon)) {
    const el = icon as React.ReactElement<{ className?: string }>;
    const existing = el.props.className ?? "";
    renderedIcon = React.cloneElement(el, {
      className: `${iconSize} ${existing}`.trim(),
    });
  }

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
        minHeight, // ✅ added
        "transition-all",
        animationDuration,
        onClick ? "cursor-pointer" : "",
        className,
      ].join(" ")}
    >
      <div className={["flex items-center min-w-0 h-full", gap].join(" ")}>
        <div
          className={[
            "flex-shrink-0 text-white",
            `group-hover:text-${hoverColor}`,
            "transition-colors",
            animationDuration,
          ].join(" ")}
        >
          {renderedIcon}
        </div>

        <span
          className={[
            "text-white",
            textSize,
            "font-normal",
            "group-hover:text-orange-100",
            "transition-colors",
            animationDuration,
            "min-w-0 whitespace-normal break-words leading-snug",
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