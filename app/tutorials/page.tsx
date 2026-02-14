"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/app/components/saas/common/GlassAccordion";
import { tutorialsItems } from "@/app/components/saas/tutorials/mockData";

export default function TutorialsPage() {
  return (
    <CommonLayout navbar={<Navigation />}>
      <GlassPolicyLayout title="Tutorials" backHref="/">
        <GlassAccordion items={tutorialsItems} defaultOpenId="getting-started" />
      </GlassPolicyLayout>
    </CommonLayout>
  );
}
