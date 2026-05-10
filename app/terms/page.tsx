"use client";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/landing/Navigation";

import GlassPolicyLayout from "@/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/components/saas/common/GlassAccordion";
import { termsItems } from "@/components/saas/termsofservices/mockData";

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
