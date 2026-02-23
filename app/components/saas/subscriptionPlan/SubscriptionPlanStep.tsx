import { useState } from "react";
import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import PlanCardGrid from "@/app/components/saas/subscriptionPlan/PlanCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  completedSteps: number;
};

export default function SubscriptionPlanStep({ data, onNext, onBack }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<string>(data.subscriptionPlan);

  const canProceed = selectedPlan.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ subscriptionPlan: selectedPlan });
  };

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

      <div className="mt-10 flex items-center justify-center mb-20">
        <div className="flex w-full max-w-xl items-center justify-between text-white">
          <button
            onClick={onBack}
            className="font-semibold hover:opacity-80 cursor-pointer"
          >
            {"< Back"}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed}
            className={`font-semibold transition-opacity ${
              canProceed
                ? "hover:opacity-80 cursor-pointer"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            {"Next >"}
          </button>
        </div>
      </div>
    </>
  );
}