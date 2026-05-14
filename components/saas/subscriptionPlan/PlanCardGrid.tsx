"use client";

import React from "react";
import BaseCard from "@/components/saas/common/BaseCard";

type Props = {
  selected: string;
  onSelect: (plan: string) => void;
};

const PLANS = [
  {
    id: "SUB_FREE",
    title: "FREE",
    price: "$0.00/mo",
    features: [
      { label: "Branches 5"      , available: true },
      { label: "Cashier accounts Up to 2 per branch" , available: true },
      { label: "Product variants Up to 250" , available: true },
      { label: "Customers Up to 500" , available: true },
      { label: "Orders / month 1,000 per branch" , available: true },
      { label: "Reports Basic" , available: true },
      { label: "Support Email" , available: true },
      { label: "AI Prediction Not included" , available: true },
    ],
  },
  {
    id: "SUB_PRO",
    title: "PRO",
    price: "$29.99/mo",
    features: [
      { label: "Branches Up to 15"  , available: true },
      { label: "Cashier accounts Up to 25 per branch" , available: true },
      { label: "Product variants Unlimited" , available: true },
      { label: "Customers Unlimited" , available: true },
      { label: "Orders / month 10,000 per branch" , available: true },
      { label: "Reports Advanced" , available: true },
      { label: "Support Priority" , available: true },
      { label: "AI Prediction Included" , available: true },
    ],
  },
  {
    id: "SUB_ENTERPRISE",
    title: "ENTERPRISE",
    price: "$99.99/mo",
    features: [
      { label: "Branches Unlimited"  , available: true },
      { label: "Cashier accounts Unlimited per branch" , available: true },
      { label: "Product variants Unlimited" , available: true },
      { label: "Customers Unlimited" , available: true },
      { label: "Orders / month Unlimited per branch" , available: true },
      { label: "Reports Custom" , available: true },
      { label: "Support 24/7 Dedicated" , available: true },
      { label: "AI Prediction Full suite" , available: true },
    ],
  },
];

const PlanCardGrid = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start px-15">
      {PLANS.map((plan) => (
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