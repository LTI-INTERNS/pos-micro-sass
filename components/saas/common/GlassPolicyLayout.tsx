"use client";

import React from "react";
import { useRouter } from "next/navigation";
import GlassBackground from "@/components/saas/common/GlassBackground";

type GlassPolicyLayoutProps = {
  title: string;
  backgroundImage?: string;

  /** fallback route if no history */
  backHref?: string;

  /** default true */
  showBack?: boolean;

  /** Page body */
  children: React.ReactNode;

  /** Optional extra wrapper classes */
  className?: string;

  /** max height of the scrollable content area (default: 70vh) */
  contentMaxHeight?: string | number;

  /** fixed max width for the card (default: 960px) */
  cardMaxWidthPx?: number;
};

export default function GlassPolicyLayout({
  title,
  backgroundImage,
  backHref = "/", // fallback if no history
  showBack = true,
  children,
  className = "",
  contentMaxHeight = "70vh",
  cardMaxWidthPx = 960,
}: GlassPolicyLayoutProps) {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  };

  const Content = (
    <div className={`w-full px-4 sm:px-6 md:px-10 py-10 ${className}`}>
      {/* FIXED WIDTH CENTER GLASS CARD */}
      <div
        className="mx-auto w-full rounded-3xl border border-white/25 bg-black/35 backdrop-blur-md shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ maxWidth: `${cardMaxWidthPx}px` }}
      >
        <div className="p-6 sm:p-10">
          {/* Header */}
          <div className="relative flex items-center justify-center mb-6">
            {showBack && (
              <button
                onClick={handleBack}
                className="absolute left-0 text-white/80 hover:text-white text-sm flex items-center gap-2"
                type="button"
              >
                <span className="text-xl leading-none cursor-pointer">‹</span>
                <span className="cursor-pointer">Back</span>
              </button>
            )}

            <h1 className="text-white text-xl sm:text-2xl font-semibold">
              {title}
            </h1>
          </div>

          {/* Scrollable content (scrollbar hidden) */}
          <div className="relative">
            <div
              className="text-white/85 overflow-y-auto scrollbar-hide pr-2"
              style={{ maxHeight: contentMaxHeight }}
            >
              {children}
            </div>

            {/* Optional subtle fade to hint scroll (remove if you don't want it) */}
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/35 to-transparent rounded-b-3xl" />
          </div>
        </div>
      </div>
    </div>
  );

  if (backgroundImage) {
    return <GlassBackground>{Content}</GlassBackground>;
  }

  return Content;
}
