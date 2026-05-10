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
    id:          "basic",
    subType:     "FREE",
    name:        "Basic",
    price:       "$0.00",
    billingCycle: "month",
    description: "Perfect for small shops just getting started.",
    features: [
      { label: "Branches",       value: "1" },
      { label: "Staff accounts", value: "Up to 5" },
      { label: "Products",       value: "Up to 200" },
      { label: "Customers",      value: "Up to 500" },
      { label: "Orders / month", value: "1,000" },
      { label: "Reports",        value: "Basic" },
      { label: "Support",        value: "Email" },
      { label: "AI Prediction",  value: "Not included" },
    ],
  },

  {
    id:          "pro",
    subType:     "PRO",
    name:        "Pro",
    price:       "$29",
    billingCycle: "month",
    description: "For growing businesses that need more power.",
    badge: "Most Popular",
    features: [
      { label: "Branches",       value: "Up to 5" },
      { label: "Staff accounts", value: "Up to 25" },
      { label: "Products",       value: "Unlimited" },
      { label: "Customers",      value: "Unlimited" },
      { label: "Orders / month", value: "10,000" },
      { label: "Reports",        value: "Advanced" },
      { label: "Support",        value: "Priority" },
      { label: "AI Prediction",  value: "Included" },
    ],
  },

  {
    id:          "advanced",
    subType:     "ENTERPRISE",
    name:        "Advanced",
    price:       "$79",
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
