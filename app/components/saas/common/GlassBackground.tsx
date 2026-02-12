"use client";

import React from "react";

type GlassBackgroundProps = {
  children?: React.ReactNode;
  className?: string;
};

export default function GlassBackground({
  children,
  className = "",
}: GlassBackgroundProps) {
  return (
    <div
      className="relative min-h-screen w-full flex items-center justify-center bg-cover bg-center px-4 sm:px-6 md:px-10 py-10"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Glass Container with border glow */}
      <div className="relative z-10 w-full max-w-6xl">
        
        {/* Outer glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-orange-500/20 to-transparent blur-xl"></div>
        
        {/* Glass Container */}
        <div
          className={`relative rounded-2xl backdrop-blur-md bg-black/30 border-2 border-white/30 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] w-full ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
