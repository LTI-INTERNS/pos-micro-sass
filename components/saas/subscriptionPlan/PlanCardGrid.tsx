"use client";

import React from "react";
import BaseCard from "@/components/saas/common/BaseCard";
import { planCardsData } from "@/components/Admin/settings/subscriptionplan/planCardsData"; // ✅ adjust path

type Props = {
  selected: string;
  onSelect: (plan: string) => void;
};

const PlanCardGrid = ({ selected, onSelect }: Props) => {

  const plans = planCardsData.map((plan) => ({
    id: plan.id,
    title: plan.name.toUpperCase(),
    price: `${plan.price}/${plan.billingCycle}`,

    features: plan.features.map((f) => ({
      label: `${f.label}: ${f.value}`,
      
      available: f.value.toLowerCase() !== "not included",
    })),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start px-15">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`
            rounded-2xl transition-all duration-200
            ${selected === plan.id
              ? "ring-4 ring-white-400 scale-[1.03] shadow-2xl"
              : "ring-0 hover:scale-[1.01] hover:shadow-xl"
            }
          `}
        >
          <BaseCard
            title={plan.title}
            price={plan.price}
            features={plan.features}
            showButton
            buttonLabel={selected === plan.id ? "✓ Selected" : "Select"}
            onClick={() => onSelect(plan.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default PlanCardGrid;