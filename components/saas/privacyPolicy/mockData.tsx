import type { AccordionItem } from "@/components/saas/common/GlassAccordion";

export const privacyItems: AccordionItem[] = [
  {
    id: "intro",
    title: "1. Introduction",
    content: (
      <p>
        We respect your privacy and are committed to protecting personal data.
        This Privacy Policy explains how our POS Micro-SaaS platform (“the Platform”)
        collects, uses, stores, and protects information when used by Retail stores,
        Restaurants/Cafés, and Grocery/Supermarket businesses.
      </p>
    ),
  },
  {
    id: "collect",
    title: "2. Information We Collect",
    content: (
      <div className="space-y-4">
        <div>
          <p className="font-semibold">a) Business Information</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Business name</li>
            <li>Business category (Retail / Restaurant / Grocery)</li>
            <li>Branch details</li>
            <li>Contact email and phone</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">b) Staff Information</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Name</li>
            <li>Role (Admin, Manager, Cashier, etc.)</li>
            <li>Login credentials (encrypted)</li>
          </ul>
        </div>

        <div>
          <p className="font-semibold">c) Customer Information (Optional)</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Name</li>
            <li>Phone number</li>
            <li>Email address</li>
          </ul>
          <p className="mt-2">
            Customer data is optional and only collected when required for receipts,
            loyalty, or order tracking.
          </p>
        </div>

        <div>
          <p className="font-semibold">d) Transaction Data</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Orders and invoices</li>
            <li>Payment references</li>
            <li>Refund records</li>
          </ul>
          <p className="mt-2">
            ⚠️ We do not store credit/debit card details.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: "use",
    title: "3. How We Use Information",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>To operate and maintain POS functionality</li>
        <li>To generate reports and analytics</li>
        <li>To manage staff access and permissions</li>
        <li>To comply with legal and accounting requirements</li>
      </ul>
    ),
  },
  {
    id: "isolation",
    title: "4. Data Isolation & Multi-Tenancy",
    content: (
      <p>
        Each business using the Platform operates as an independent tenant.
        Your data is logically isolated and never shared with other businesses.
      </p>
    ),
  },
  {
    id: "access",
    title: "5. Access Control",
    content: (
      <>
        <p>Access to data is restricted by user roles:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li><strong>Admins:</strong> Full access</li>
          <li><strong>Managers:</strong> Limited operational access</li>
          <li><strong>Cashiers:</strong> Order-related access only</li>
        </ul>
      </>
    ),
  },
  {
    id: "retention",
    title: "6. Data Retention",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Transaction data: retained as required by law</li>
        <li>Customer data: retained until deleted by the business</li>
        <li>System logs: retained for security and auditing purposes</li>
      </ul>
    ),
  },
  {
    id: "security",
    title: "7. Data Security",
    content: (
      <>
        <p>We implement industry-standard security practices including:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Encrypted connections (HTTPS)</li>
          <li>Secure password hashing</li>
          <li>Role-based access control</li>
          <li>Session management and activity logging</li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party",
    title: "8. Third-Party Services",
    content: (
      <>
        <p>We may integrate third-party services for:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Payments</li>
          <li>Hosting infrastructure</li>
        </ul>
        <p className="mt-3">
          These services only receive the minimum data required to function.
        </p>
      </>
    ),
  },
  {
    id: "rights",
    title: "9. Your Rights",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Access your data</li>
        <li>Export reports</li>
        <li>Delete or anonymize customer data</li>
        <li>Manage staff permissions</li>
      </ul>
    ),
  },
  {
    id: "updates",
    title: "10. Policy Updates",
    content: (
      <p>
        We may update this Privacy Policy from time to time.
        Any changes will be communicated through the Platform.
      </p>
    ),
  },
  {
    id: "contact",
    title: "11. Contact",
    content: (
      <p>
        For privacy-related questions, contact:
        <br />
        📧 lankatechinnovations@gmail.com
      </p>
    ),
  },
];
