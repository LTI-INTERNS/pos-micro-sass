"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/app/components/saas/common/GlassAccordion";
import { privacyItems } from "@/app/components/saas/privacyPolicy/mockData";

export default function PrivacyPage() {
  return (
    <CommonLayout navbar={<Navigation />}>
      <GlassPolicyLayout title="Privacy Policy" backHref="/">
        <GlassAccordion items={privacyItems} defaultOpenId="intro" />
      </GlassPolicyLayout>
    </CommonLayout>
  );
}
