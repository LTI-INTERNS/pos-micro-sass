"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/landing/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/app/components/saas/common/GlassAccordion";
import { termsItems } from "@/app/components/saas/termsofservices/mockData";

export default function TermsPage() {
  return (
    <CommonLayout navbar={<Navigation />}>
      <div className = "pt-24 pb-10">
      <GlassPolicyLayout title="Terms of Service" backHref="/">
        <GlassAccordion items={termsItems} defaultOpenId="intro" />
      </GlassPolicyLayout>
      </div>
    </CommonLayout>
  );
}
