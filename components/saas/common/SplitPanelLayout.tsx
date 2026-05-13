"use client";

import React from "react";

type SplitPanelLayoutProps = {
  left?: React.ReactNode;
  right: React.ReactNode;
  showDivider?: boolean;
  leftClassName?: string;
  rightClassName?: string;
};

export default function SplitPanelLayout({
  left,
  right,
  showDivider = true,
  leftClassName = "",
  rightClassName = "",
}: SplitPanelLayoutProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* LEFT PANEL */}
      {left && (
        <div
          className={[
            "relative flex items-center justify-center p-10", 
            showDivider ? "border-b border-white/10 md:border-b-0" : "",
            leftClassName,
          ].join(" ")}
        >
          {left}
          
          {showDivider && (
            <div className="hidden md:block absolute right-0 top-10 bottom-10 w-px bg-gradient-to-b from-transparent via-white/40 to-transparent" />
          )}
        </div>
      )}

      {/* RIGHT PANEL */}
      <div
        className={[
          "flex items-center justify-center p-10",
          rightClassName,
        ].join(" ")}
      >
        {right}
      </div>
    </div>
  );
}
