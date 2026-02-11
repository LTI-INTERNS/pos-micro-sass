"use client";

import GlassPolicyLayout from "@/app/components/saas/common/GlassPolicyLayout";
import GlassAccordion, {
  type AccordionItem,
} from "@/app/components/saas/common/GlassAccordion";

export default function TermsPage() {
  const items: AccordionItem[] = [
    {
      id: "intro",
      title: "Introduction",
      content: (
        <>
          <p>
            These Terms of Service (“Terms”) govern your access to and use of
            our cloud-based POS micro-SaaS platform for Retail stores,
            Restaurants/Cafés, and Grocery/Supermarket businesses.
          </p>
          <p className="mt-3">
            By creating an account or using the platform, you agree to be bound
            by these Terms.
          </p>
        </>
      ),
    },
    {
      id: "who-can-use",
      title: "Who can use the Service",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>You must be authorized to represent your business.</li>
          <li>You must provide accurate account information.</li>
          <li>You must comply with applicable laws and regulations.</li>
        </ul>
      ),
    },
    {
      id: "service-description",
      title: "Description of the service",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Sales, invoicing, receipts, refunds, and daily reporting.</li>
          <li>Inventory/catalog management, variants, and stock tracking.</li>
          <li>Customer management and loyalty features (if enabled).</li>
          <li>Staff roles and permissions to control access.</li>
        </ul>
      ),
    },
    {
      id: "account-security",
      title: "Account Registration & Security",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Keep passwords and OTP codes confidential.</li>
          <li>Use strong passwords for staff accounts.</li>
          <li>
            Notify us promptly if you suspect unauthorized access to your
            account.
          </li>
        </ul>
      ),
    },
    {
      id: "staff-permissions",
      title: "Staff Access & Permissions",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>You control which staff can access which features.</li>
          <li>Admins are responsible for permission setup and reviews.</li>
          <li>Any actions done by staff are treated as your business actions.</li>
        </ul>
      ),
    },
    {
      id: "customer-data",
      title: "Use of Customer Data",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Customer data is used to support POS operations and receipts.</li>
          <li>
            You are responsible for collecting customer data lawfully (e.g.,
            consent where required).
          </li>
          <li>
            We protect customer data as described in our Privacy Policy.
          </li>
        </ul>
      ),
    },
    {
      id: "payments",
      title: "Payments & Subscriptions",
      content: (
        <ul className="list-disc pl-5 space-y-2">
          <li>Some features may require a subscription plan.</li>
          <li>Billing cycles and fees are shown inside the platform.</li>
          <li>
            Late or failed payments may result in limited access until resolved.
          </li>
        </ul>
      ),
    },
  ];

  return (
    <GlassPolicyLayout title="Terms of Service" backgroundImage="/saasbackground.png">
      <GlassAccordion items={items} defaultOpenId="intro" />
    </GlassPolicyLayout>
  );
}
