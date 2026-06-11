"use client";

import type { SubscriptionType } from "@/types/subscription.types";

const PLAN_STYLES: Record<SubscriptionType, string> = {
  FREE: "bg-gray-100 text-gray-600",
  PRO: "bg-orange-100 text-orange-700",
  ENTERPRISE: "bg-purple-100 text-purple-700",
};

type Props = { plan: SubscriptionType };

export default function PlanBadge({ plan }: Props) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
        PLAN_STYLES[plan] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {plan}
    </span>
  );
}
