"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PlanCard from "./PlanCard";
import { planCardsData } from "./planCardsData";

type Props = {
  defaultPlanId?: string;
  onUpgrade?: (planId: string) => void;
};

export default function SubscriptionPlanCards({
  defaultPlanId = "basic",
  onUpgrade,
}: Props) {
  const router = useRouter();
  const [currentPlanId] = useState(defaultPlanId);

  const handleUpgrade = (planId: string) => {
    onUpgrade?.(planId);

    router.push(`/payment?planId=${planId}`);
  };


  const sortedPlans = [...planCardsData].sort((a, b) => {
    if (a.id === currentPlanId) return -1;
    if (b.id === currentPlanId) return 1;
    return 0;
  });

  return (
    <div className="flex flex-col gap-4">
      {sortedPlans.map((plan) => {
        const isCurrent = currentPlanId === plan.id;

        return (
          <PlanCard
            key={plan.id}
            name={plan.name}
            price={plan.price}
            billingCycle={plan.billingCycle}
            description={plan.description}
            badge={plan.badge}
            features={plan.features}
            isCurrent={isCurrent}
            upgradeLabel="Upgrade to this plan"
            onUpgrade={!isCurrent ? () => handleUpgrade(plan.id) : undefined}
          />
        );
      })}
    </div>
  );
}