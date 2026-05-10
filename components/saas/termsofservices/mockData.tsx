import type { AccordionItem } from "@/components/saas/common/GlassAccordion";

export const termsItems: AccordionItem[] = [
  {
    id: "intro",
    title: "1. Introduction",
    content: (
      <>
        <p className="font-medium">Last updated: 14/02/2026</p>
        <p className="mt-3">
          These Terms of Service (“Terms”) govern your access to and use of
          [Your Product Name], a cloud-based Point of Sale (POS) micro-SaaS
          platform designed for Retail stores, Restaurants or Cafés, and
          Grocery or Supermarket businesses.
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
    title: "2. Who Can Use the Service",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You are a business owner, authorized representative, or staff member.</li>
        <li>You have authority to act on behalf of the business.</li>
        <li>You comply with all applicable laws and regulations.</li>
        <li>Accounts may not be used for unlawful or fraudulent activities.</li>
      </ul>
    ),
  },
  {
    id: "service-description",
    title: "3. Description of the Service",
    content: (
      <>
        <p>Our POS platform provides tools to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Process sales and issue invoices.</li>
          <li>Manage products, inventory, and pricing.</li>
          <li>Manage staff roles and permissions.</li>
          <li>Track sales, payments, and reports.</li>
          <li>Manage optional customer data and loyalty features.</li>
        </ul>
        <p className="mt-3">
          Features may vary depending on your subscription plan or business type.
        </p>
      </>
    ),
  },
  {
    id: "account-security",
    title: "4. Account Registration & Security",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You are responsible for maintaining accurate account information.</li>
        <li>You must keep login credentials secure.</li>
        <li>You are responsible for all activity under your account.</li>
        <li>
          If you believe your account has been compromised, you must notify us immediately.
        </li>
      </ul>
    ),
  },
  {
    id: "staff-permissions",
    title: "5. Staff Access & Permissions",
    content: (
      <>
        <p>Business owners or administrators can:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Add or remove staff accounts.</li>
          <li>Assign roles (Admin, Manager, Cashier, etc.).</li>
          <li>Control access to system features.</li>
        </ul>
        <p className="mt-3">
          You are responsible for managing staff access and actions within your account.
        </p>
      </>
    ),
  },
  {
    id: "customer-data",
    title: "6. Use of Customer Data",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>You are responsible for informing your customers.</li>
        <li>You must comply with applicable data protection laws.</li>
        <li>Customer data must be used only for legitimate business purposes.</li>
        <li>
          We process customer data only as required to provide the service.
        </li>
      </ul>
    ),
  },
  {
    id: "payments",
    title: "7. Payments & Subscriptions",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Some features require a paid subscription.</li>
        <li>Fees are billed according to the selected plan.</li>
        <li>Subscription fees are non-refundable unless stated otherwise.</li>
        <li>We may update pricing or plans with prior notice.</li>
      </ul>
    ),
  },
  {
    id: "data-ownership",
    title: "8. Data Ownership",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>All business, transaction, and customer data belongs to the merchant.</li>
        <li>We do not claim ownership of your data.</li>
        <li>
          You grant us permission to process data solely to provide and improve the service.
        </li>
      </ul>
    ),
  },
  {
    id: "acceptable-use",
    title: "9. Acceptable Use",
    content: (
      <>
        <p>You agree not to:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Misuse the platform or attempt unauthorized access.</li>
          <li>Interfere with system performance or security.</li>
          <li>Use the service for illegal or harmful activities.</li>
          <li>Resell or sublicense the service without permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "availability",
    title: "10. Service Availability",
    content: (
      <>
        <p>
          We aim to provide reliable and continuous service. However, the platform
          may occasionally be unavailable due to:
        </p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>Maintenance.</li>
          <li>Updates.</li>
          <li>Technical issues beyond our control.</li>
        </ul>
        <p className="mt-3">
          We do not guarantee uninterrupted availability.
        </p>
      </>
    ),
  },
  {
    id: "termination",
    title: "11. Termination",
    content: (
      <>
        <p>We may suspend or terminate access if:</p>
        <ul className="list-disc pl-5 space-y-2 mt-3">
          <li>These Terms are violated.</li>
          <li>The service is misused.</li>
          <li>Required payments are not made.</li>
        </ul>
        <p className="mt-3">
          You may stop using the service at any time by closing your account.
        </p>
      </>
    ),
  },
  {
    id: "liability",
    title: "12. Limitation of Liability",
    content: (
      <ul className="list-disc pl-5 space-y-2">
        <li>We are not liable for indirect or consequential losses.</li>
        <li>
          We are not responsible for business losses, lost profits, or data
          inaccuracies caused by misuse.
        </li>
        <li>The service is provided on an “as-is” basis.</li>
      </ul>
    ),
  },
  {
    id: "changes",
    title: "13. Changes to the Terms",
    content: (
      <p>
        We may update these Terms from time to time. Continued use of the
        platform after updates means you accept the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "14. Contact Information",
    content: (
      <p>
        For questions regarding these Terms:
        <br />
        📧 lankatechinnovations@gmail.com
      </p>
    ),
  },
];
