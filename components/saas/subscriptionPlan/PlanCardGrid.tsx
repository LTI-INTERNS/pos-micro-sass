"use client";

import React from "react";
import BaseCard from "../common/BaseCard";

type Props = {
  selected: string;
  onSelect: (plan: string) => void;
};

const PLANS = [
  {
    id: "free",
    title: "FREE",
    price: "$0.00/mo",
    features: [
      { label: "Basic POS",            available: true },
      { label: "Single Branch",        available: true },
      { label: "Limited Products",     available: true },
      { label: "Advanced Analytics",   available: false },
      { label: "Priority Support",     available: false },
    ],
  },
  {
    id: "pro",
    title: "PRO",
    price: "$29.99/mo",
    features: [
      { label: "Advanced POS",         available: true },
      { label: "Multiple Branches",    available: true },
      { label: "Unlimited Products",   available: true },
      { label: "Advanced Analytics",   available: true },
      { label: "Priority Support",     available: true },
    ],
  },
  {
    id: "enterprise",
    title: "ENTERPRISE",
    price: "$99.99/mo",
    features: [
      { label: "Enterprise POS",       available: true },
      { label: "Unlimited Branches",   available: true },
      { label: "Unlimited Products",   available: true },
      { label: "Advanced Analytics",   available: true },
      { label: "24/7 Support",         available: true },
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