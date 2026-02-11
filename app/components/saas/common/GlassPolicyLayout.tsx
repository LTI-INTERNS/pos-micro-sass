"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GlassBackground from "./GlassBackground";

type GlassPolicyLayoutProps = {
  title: string;
  backgroundImage: string;

  /** If provided, back button will go to this route */
  backHref?: string;

  /** default true */
  showBack?: boolean;

  /** Page body */
  children: React.ReactNode;

  /** Optional extra padding/classes inside */
  className?: string;
};

export default function GlassPolicyLayout({
  title,
  backgroundImage,
  backHref,
  showBack = true,
  children,
  className = "",
}: GlassPolicyLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backHref) router.push(backHref);
    else router.back();
  };

  return (
    <GlassBackground backgroundImage={backgroundImage}>
      <div className={`w-full px-6 sm:px-10 py-10 ${className}`}>
        {/* Header */}
        <div className="relative flex items-center justify-center mb-8">
          {showBack && (
            <button
              onClick={handleBack}
              className="absolute left-0 text-white/80 hover:text-white text-sm flex items-center gap-2"
            >
              <span className="text-xl leading-none">‹</span>
              <span>Back</span>
            </button>
          )}

          <h1 className="text-white text-xl sm:text-2xl font-semibold">
            {title}
          </h1>
        </div>

        {/* Content area */}
        <div className="text-white/85">{children}</div>
      </div>
    </GlassBackground>
  );
}
