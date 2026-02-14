"use client";

import React from "react";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

type AuthLayoutProps = {
  backgroundImage?: string;
  illustrationSrc: string;
  children: React.ReactNode;
};

export default function AuthLayout({
  backgroundImage = "/saasbg.png",
  illustrationSrc,
  children,
}: AuthLayoutProps) {
  return (
    <GlassBackground backgroundImage={backgroundImage}>
      <SplitPanelLayout
        showDivider
        left={
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-lg rounded-2xl overflow-hidden bg-orange-500/10">
              <img
                src={illustrationSrc}
                alt="Auth illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        }
        right={<div className="w-full flex items-center justify-center">{children}</div>}
        leftClassName="p-8 md:p-10"
        rightClassName="p-8 md:p-10"
      />
    </GlassBackground>
  );
}
