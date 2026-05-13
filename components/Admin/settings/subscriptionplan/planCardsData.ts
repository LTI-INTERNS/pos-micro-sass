import type { SubscriptionType } from "@/types/subscription.types";

export type PlanFeature = {
  label: string;
  value: string;
};

export type PlanCardData = {
  id:          string;
  subType:     SubscriptionType;   // ← links card to the DB enum value
  name:        string;
  price:       string;
  billingCycle: string;
  description: string;
  badge?: string;
  features: PlanFeature[];
};

export const planCardsData: PlanCardData[] = [

  {
    id:          "free",
    subType:     "FREE",
    name:        "FREE",
    price:       "$0.00",
    billingCycle: "month",
    description: "Perfect for small shops just getting started.",
    features: [
      { label: "Branches",       value: "5" },
      { label: "Staff accounts", value: "Up to 2" },
      { label: "Products",       value: "Up to 250" },
      { label: "Customers",      value: "Up to 500" },
      { label: "Orders / month", value: "1,000 per branch" },
      { label: "Reports",        value: "Basic" },
      { label: "Support",        value: "Email" },
      { label: "AI Prediction",  value: "Not included" },
    ],
  },

  {
    id:          "pro",
    subType:     "PRO",
    name:        "PRO",
    price:       "$29.99",
    billingCycle: "month",
    description: "For growing businesses that need more power.",
    badge: "Most Popular",
    features: [
      { label: "Branches",       value: "Up to 15" },
      { label: "Staff accounts", value: "Up to 25" },
      { label: "Products",       value: "Unlimited" },
      { label: "Customers",      value: "Unlimited" },
      { label: "Orders / month", value: "10,000 per branch" },
      { label: "Reports",        value: "Advanced" },
      { label: "Support",        value: "Priority" },
      { label: "AI Prediction",  value: "Included" },
    ],
  },

  {
    id:          "enterprise",
    subType:     "ENTERPRISE",
    name:        "ENTERPRISE",
    price:       "$99.99",
    billingCycle: "month",
    description: "Enterprise-grade features for large operations.",
    badge: "Enterprise",
    features: [
      { label: "Branches",       value: "Unlimited" },
      { label: "Staff accounts", value: "Unlimited" },
      { label: "Products",       value: "Unlimited" },
      { label: "Customers",      value: "Unlimited" },
      { label: "Orders / month", value: "Unlimited" },
      { label: "Reports",        value: "Custom" },
      { label: "Support",        value: "24/7 Dedicated" },
      { label: "AI Prediction",  value: "Full suite" },
    ],
  },
];
