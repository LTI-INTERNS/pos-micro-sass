"use client";

import React from "react";

type GlassBackgroundProps = {
  children?: React.ReactNode;
  backgroundImage?: string;
  className?: string;
  fit?: boolean;
  showFrame?: boolean;
  constrained?: boolean;
  strongFrame?: boolean;
};

export default function GlassBackground({
  children,
  backgroundImage,
  className = "",
  fit = false,
  showFrame = true,
  constrained = true,
  strongFrame = false,
}: GlassBackgroundProps) {
  return (
    <div
      className={[
        "relative w-full bg-cover bg-center px-4 sm:px-6 md:px-10",
        fit ? "py-0" : "min-h-screen flex items-center justify-center py-10",
      ].join(" ")}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined
      }
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content wrapper */}
      <div
        className={[
          "relative z-10 w-full",
          constrained ? "max-w-6xl mx-auto" : "",
          className,
        ].join(" ")}
      >
        {/* Soft glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-orange-500/15 to-transparent blur-2xl" />

        {/* Glass frame */}
        <div
          className={[
            "relative rounded-3xl backdrop-blur-md bg-black/30 w-full",
            showFrame
              ? strongFrame
                ? "border-2 border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
                : "border border-white/12 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
              : "shadow-2xl",
          ].join(" ")}
        >
          {children}
        </div>
      </div>
    </div>
  );
}