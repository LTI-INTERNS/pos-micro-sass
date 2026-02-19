"use client";

import { useState } from "react";
import PlanCard from "./PlanCard";
import { planCardsData, PlanCardData } from "./planCardsData";
import PaymentModal, { PaymentPlan } from "./PaymentModal";

type Props = {
  defaultPlanId?: string;
  onUpgrade?: (planId: string) => void;
};

export default function SubscriptionPlanCards({
  defaultPlanId = "basic",
  onUpgrade,
}: Props) {
  const [currentPlanId, setCurrentPlanId] = useState(defaultPlanId);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);

  const handleUpgradeClick = (plan: PlanCardData) => {
    setSelectedPlan({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      billingCycle: plan.billingCycle,
    });
  };

  const handlePaymentSuccess = (planId: string) => {
    setCurrentPlanId(planId);
    onUpgrade?.(planId);
    setSelectedPlan(null);
  };


  const sortedPlans = [...planCardsData].sort((a, b) => {
    if (a.id === currentPlanId) return -1;
    if (b.id === currentPlanId) return 1;
    return 0;
  });

  return (
    <>
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
              onUpgrade={!isCurrent ? () => handleUpgradeClick(plan) : undefined}
            />
          );
        })}
      </div>

      <PaymentModal
        open={!!selectedPlan}
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSuccess={handlePaymentSuccess}
      />
    </>
  );
}