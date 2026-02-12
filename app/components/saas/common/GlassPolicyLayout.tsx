"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GlassBackground from "./GlassBackground";

type GlassPolicyLayoutProps = {
  title: string;

  /**
   * OPTIONAL:
   * If you use CommonLayout (background already exists), you can skip this.
   * If you want GlassPolicyLayout to control its own background, pass it.
   */
  backgroundImage?: string;

  /** If provided, back button will go to this route */
  backHref?: string;

  /** default true */
  showBack?: boolean;

  /** Page body */
  children: React.ReactNode;

  /** Optional extra wrapper classes */
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

  const Content = (
    <div className={`w-full px-4 sm:px-6 md:px-10 py-10 ${className}`}>
      {/* BIG CENTER GLASS CARD */}
      <div className="mx-auto w-full max-w-6xl rounded-3xl border border-white/25 bg-black/35 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="relative flex items-center justify-center mb-8">
            {showBack && (
              <button
                onClick={handleBack}
                className="absolute left-0 text-white/80 hover:text-white text-sm flex items-center gap-2"
                type="button"
              >
                <span className="text-xl leading-none">‹</span>
                <span>Back</span>
              </button>
            )}

            <h1 className="text-white text-xl sm:text-2xl font-semibold">
              {title}
            </h1>
          </div>

          {/* Content */}
          <div className="text-white/85">{children}</div>
        </div>
      </div>
    </div>
  );

  // ✅ If backgroundImage is provided, use GlassBackground
  // ✅ Otherwise, just render the centered glass card (for CommonLayout usage)
  if (backgroundImage) {
    return <GlassBackground>{Content}</GlassBackground>;
  }

  return Content;
}
