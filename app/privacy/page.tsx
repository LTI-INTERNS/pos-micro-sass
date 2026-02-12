"use client";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion, { type AccordionItem } from "@/app/components/saas/common/GlassAccordion";

export default function PrivacyPage() {
  const items: AccordionItem[] = [
    {
      id: "intro",
      title: "Introduction",
      content: (
        <p>
          We respect your privacy and are committed to protecting personal
          data. This Privacy Policy explains how our POS micro-SaaS platform
          collects, uses, stores, and protects information when used by Retail
          stores, Restaurants/Cafés, and Grocery/Supermarket businesses.
        </p>
      ),
    },
    {
      id: "collect",
      title: "Information We Collect",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Account info (name, email, business details).</li>
          <li>POS usage data (sales, receipts, inventory changes).</li>
          <li>Device and log data (IP, browser/device details).</li>
          <li>Optional customer info entered by the business (phone/email).</li>
        </ul>
      ),
    },
    {
      id: "use",
      title: "How we use Information",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>To provide core POS services and reporting.</li>
          <li>To improve performance, reliability, and user experience.</li>
          <li>To support security, fraud prevention, and audits.</li>
          <li>To send service notices (billing, security, system updates).</li>
        </ul>
      ),
    },
    {
      id: "isolation",
      title: "Data Isolation & Multi-Tenancy",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Each business account is logically separated from others.</li>
          <li>Access is controlled by roles/permissions set by the business.</li>
          <li>We enforce system-level controls to prevent data leakage.</li>
        </ul>
      ),
    },
    {
      id: "access",
      title: "Access Control",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Role-based access for Admin / Cashier / Staff.</li>
          <li>Admins can add/remove staff and adjust permissions.</li>
          <li>We log key actions for accountability and troubleshooting.</li>
        </ul>
      ),
    },
    {
      id: "retention",
      title: "Data Retention",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>We retain data as long as needed to provide the service.</li>
          <li>Some data may be retained for legal/tax/compliance reasons.</li>
          <li>You may request export of your data (where supported in the app).</li>
        </ul>
      ),
    },
    {
      id: "security",
      title: "Data Security",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Encryption where appropriate and secure transport (HTTPS).</li>
          <li>Access controls and least-privilege staff permissions.</li>
          <li>Monitoring and logging to detect suspicious activity.</li>
        </ul>
      ),
    },
  ];

  return (
    <CommonLayout navbar={<Navigation />}>
      <GlassPolicyLayout title="Privacy Policy" backHref="/">
        <GlassAccordion items={items} defaultOpenId="intro" />
      </GlassPolicyLayout>
    </CommonLayout>
  );
}
