"use client";

import React from "react";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import Card from "@/app/components/saas/common/FormCard";

type RegisterAuthLayoutProps = {
  children: React.ReactNode;
  backgroundImage?: string;
};

export default function RegisterAuthLayout({
  children,
  backgroundImage = "/saasbackground.png",
}: RegisterAuthLayoutProps) {
  return (
    <GlassBackground backgroundImage={backgroundImage}>
      <SplitPanelLayout
        left={
          <Card variant="gradient" padding="lg" className="w-full max-w-md">
            <h1 className="text-4xl font-extrabold leading-tight">
              Start your POS <br /> journey today.
            </h1>

            <p className="mt-6 text-white/90 leading-relaxed">
              Running a retail business is easier with LankaTech POS. We help you
              sell better, manage your entire business, and join the digital revolution.
            </p>

            <div className="my-8 h-px bg-white/30" />

            <h2 className="text-3xl font-extrabold">Need assistance?</h2>

            <div className="mt-4 text-white/95 space-y-1">
              <p>+94 123 456 789</p>
              <p>info@lankatechinnovations.com</p>
            </div>
          </Card>
        }
        right={<div className="w-full max-w-md">{children}</div>}
      />
    </GlassBackground>
  );
}
