"use client";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/landing/Navigation";

import GlassPolicyLayout from "@/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/components/saas/common/GlassAccordion";
import { privacyItems } from "@/components/saas/privacyPolicy/mockData";

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
