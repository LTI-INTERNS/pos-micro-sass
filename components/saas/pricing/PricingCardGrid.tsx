"use client";

import React from "react";
import BaseCard from "@/components/saas/common/BaseCard";
import { planCardsData } from "@/components/Admin/settings/subscriptionplan/planCardsData";

const PricingCardGrid = () => {

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start px-15">
      {plans.map((plan) => (
        <BaseCard
          key={plan.id}
          title={plan.title}
          price={plan.price}
          features={plan.features}
          showButton={false}
        />
      ))}
    </div>
  );
};

export default PricingCardGrid;