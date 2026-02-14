"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/landing/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/app/components/saas/common/GlassAccordion";
import { privacyItems } from "@/app/components/saas/privacyPolicy/mockData";

export default function PrivacyPage() {
  return (
    <CommonLayout navbar={<Navigation />}>
      <div className = "pt-24 pb-10">
      <GlassPolicyLayout title="Privacy Policy" backHref="/">
        <GlassAccordion items={privacyItems} defaultOpenId="intro" />
      </GlassPolicyLayout>
      </div>
    </CommonLayout>
  );
}
