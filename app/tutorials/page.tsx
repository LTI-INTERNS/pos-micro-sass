"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion, { type AccordionItem } from "@/app/components/saas/common/GlassAccordion";

export default function TutorialsPage() {
  const items: AccordionItem[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      content: (
        <div className="space-y-3">
          <p>
            Learn the basics: login, selecting business/branch, creating your
            first sale, and generating a receipt.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <div className="w-28 h-16 rounded-lg overflow-hidden border border-white/20 bg-black/20">
              <img
                src="/saas/tutorials/get-started.png"
                alt="Getting Started"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "role-based",
      title: "Role-Based Tutorials",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Admin: setup, staff permissions, branches, products.</li>
          <li>Cashier: billing flow, refunds, customer selection.</li>
          <li>Manager: reports, shift summaries, stock alerts.</li>
        </ul>
      ),
    },
    {
      id: "feature-micro",
      title: "Feature-Focused Micro Tutorials",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>How to add products with variants</li>
          <li>How to do stock adjustments</li>
          <li>How to apply discounts and taxes</li>
          <li>How to handle returns/refunds</li>
        </ul>
      ),
    },
    {
      id: "business-type",
      title: "Business Type specific Tutorials",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Retail: barcode scanning, inventory counts, promotions</li>
          <li>Restaurant/Café: table orders, split bills, kitchen flow</li>
          <li>Grocery: fast checkout, weighted items, bulk pricing</li>
        </ul>
      ),
    },
    {
      id: "videos",
      title: "Video Tutorials",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Short 30–60s clips for each feature</li>
          <li>Long-form walkthroughs for onboarding</li>
          <li>Release notes video for major updates</li>
        </ul>
      ),
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Can’t login / OTP not received</li>
          <li>Printer not working</li>
          <li>Payment status confusion</li>
          <li>Stock mismatch / sync issues</li>
        </ul>
      ),
    },
    {
      id: "whats-new",
      title: "What’s New",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>New features added</li>
          <li>Improvements</li>
          <li>Bug fixes</li>
        </ul>
      ),
    },
  ];

  return (
    <CommonLayout navbar={<Navigation />}>
      <GlassPolicyLayout title="Tutorials" backHref="/">
        <GlassAccordion items={items} defaultOpenId="getting-started" />
      </GlassPolicyLayout>
    </CommonLayout>
  );
}
