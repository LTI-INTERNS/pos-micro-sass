import { useState, useEffect } from "react";
import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/components/saas/common/GlassBackground";
import PlanCardGrid from "@/components/saas/subscriptionPlan/PlanCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  completedSteps: number;
  submitting?: boolean;
  onCanProceedChange?: (can: boolean) => void;
  triggerRef?: React.MutableRefObject<(() => void) | null>;
};

export default function SubscriptionPlanStep({ data, onNext, submitting = false, onCanProceedChange, triggerRef }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<string>(data.subId);

  const canProceed = selectedPlan.length > 0;

  // Notify parent whenever canProceed changes
  useEffect(() => {
    onCanProceedChange?.(canProceed);
  }, [canProceed, onCanProceedChange]);

  const handleNext = () => {
    if (!canProceed || submitting) return;
    onNext({ subId: selectedPlan });
  };

  // Expose handleNext to parent via ref
  useEffect(() => {
    if (triggerRef) triggerRef.current = handleNext;
  });

  return (
    <>
      <GlassBackground>
        <div className="container mx-auto py-15">
          <h1 className="text-3xl font-bold text-center text-white mb-20">
            Select Your Subscription Plan
          </h1>

          <PlanCardGrid
            selected={selectedPlan}
            onSelect={setSelectedPlan}
          />
        </div>
      </GlassBackground>
    </>
  );
}