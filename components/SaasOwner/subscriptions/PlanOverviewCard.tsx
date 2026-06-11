"use client";

import { Check, Building2, Pencil } from "lucide-react";
import type { PlanCardData } from "@/components/Admin/settings/subscriptionplan/planCardsData";
import type { SubscriptionType } from "@/types/subscription.types";

interface Props {
  plan: PlanCardData;
  subscriberCount: number;
  onEdit:          (type: SubscriptionType) => void;
}

export default function PlanOverviewCard({ plan, subscriberCount, onEdit }: Props) {
  const isFeatured = plan.subType === "PRO";

  return (
    <div
      className={`relative bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-sm border-2 ${
        isFeatured ? "border-orange-400" : "border-gray-200"
      }`}
    >
      {plan.badge && (
        <span
          className={`absolute top-5 right-14 text-xs font-semibold px-3 py-1 rounded-full ${
            isFeatured 
            ? "bg-orange-500 text-white"
            : "bg-gray-100 text-gray-500"
          }`}
        >
          {plan.badge}
        </span>
      )}

      {/* Edit pencil — top right corner */}
      <button
        onClick={() => onEdit(plan.subType)}
        className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center
          bg-gray-100 hover:bg-orange-100 hover:text-orange-500 text-gray-400
          transition-all cursor-pointer active:scale-90"
        title={`Edit ${plan.name} plan`}
        aria-label={`Edit ${plan.name} plan`}
      >
        <Pencil size={13} />
      </button>

      {/* Name + Price */}
      <div className="flex flex-col gap-1 pr-16">
        <h2 className="text-lg font-bold text-gray-900">{plan.name}</h2>
        <div className="flex items-baseline gap-1.5 mt-0.5">
          <span className="text-4xl font-extrabold text-gray-900 tracking-tight leading-none">
            {plan.price}
          </span>
          <span className="text-sm font-normal text-gray-400">
            / {plan.billingCycle}
          </span>
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{plan.description}</p>
      </div>

      {/* Subscriber count */}
      <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-lg px-4 py-2.5">
        <Building2 size={14} className="text-orange-500 flex-shrink-0" />
        <span className="text-xs font-bold text-orange-700">{subscriberCount}</span>
        <span className="text-xs text-gray-500">
          {subscriberCount === 1 ? "company" : "companies"} on this plan
        </span>
      </div>

      <div className="w-full h-px bg-gray-100" />

      {/* Feature list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center">
              <Check size={9} strokeWidth={2.5} className="text-orange-500" />
            </span>
            <p className="text-xs text-gray-400">
              {f.label}: <span className="font-bold text-gray-900">{f.value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
