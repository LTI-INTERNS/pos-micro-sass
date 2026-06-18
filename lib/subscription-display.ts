import type { SubscriptionDetail } from "@/lib/services/saas-owner.service";

const REPORT_LABELS: Record<string, string> = {
  BASIC:    "Basic",
  ADVANCED: "Advanced",
  CUSTOM:   "Custom",
};

const SUPPORT_LABELS: Record<string, string> = {
  EMAIL:          "Email",
  PRIORITY:       "Priority",
  DEDICATED_24_7: "24/7 Dedicated",
};

const AI_LABELS: Record<string, string> = {
  NOT_INCLUDED: "Not included",
  INCLUDED:     "Included",
  FULL_SUITE:   "Full suite",
};

function limitStr(val: number | null | undefined, suffix = ""): string {
  if (val == null) return "Unlimited";
  return `${val.toLocaleString()}${suffix}`;
}

export interface LivePlanCard {
  subType:      string;
  name:         string;
  price:        string;
  billingCycle: string;
  description:  string;
  badge?:       string;
  features: { label: string; value: string }[];
}

const PLAN_META: Record<string, { description: string; badge?: string }> = {
  FREE:       { description: "Perfect for small shops just getting started." },
  PRO:        { description: "For growing businesses that need more power.", badge: "Most Popular" },
  ENTERPRISE: { description: "Enterprise-grade features for large operations.", badge: "Enterprise" },
};

export function buildLivePlanCard(sub: SubscriptionDetail): LivePlanCard {
  const meta = PLAN_META[sub.type] ?? { description: "" };

  return {
    subType:      sub.type,
    name:         sub.type,
    price:        `$${parseFloat(sub.priceMonthly).toFixed(2)}`,
    billingCycle: "month",
    description:  meta.description,
    badge:        meta.badge,
    features: [
      { label: "Branches",            value: limitStr(sub.branchLimit) },
      { label: "Cashier accounts",    value: sub.staffLimit    != null ? `Up to ${sub.staffLimit} per branch`  : "Unlimited per branch" },
      { label: "Product variants",    value: limitStr(sub.productLimit) },
      { label: "Customers",           value: limitStr(sub.customerLimit) },
      { label: "Orders / month",      value: sub.monthlyOrderLimit != null ? `${sub.monthlyOrderLimit.toLocaleString()} per branch` : "Unlimited" },
      { label: "Reports",             value: REPORT_LABELS[sub.reportLevel]       ?? sub.reportLevel },
      { label: "Support",             value: SUPPORT_LABELS[sub.supportLevel]     ?? sub.supportLevel },
      { label: "AI Prediction",       value: AI_LABELS[sub.aiPredictionLevel]     ?? sub.aiPredictionLevel },
    ],
  };
}
