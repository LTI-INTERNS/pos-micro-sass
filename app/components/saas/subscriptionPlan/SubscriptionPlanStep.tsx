import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import PlanCardGrid from "@/app/components/saas/subscriptionPlan/PlanCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
};

export default function SubscriptionPlanStep({ data, onNext, onBack }: Props) {
  const handleNext = () => {
    // You can capture the selected subscription plan from PlanCardGrid
    // For now, just proceed to next step
    onNext({});
  };

  return (
    <>
      <GlassBackground>
        <div className="container mx-auto py-15">
          <h1 className="text-3xl font-bold text-center text-white mb-20">
            Select Your Subscription Plan
          </h1>

          <PlanCardGrid />
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
            className="font-semibold hover:opacity-80 cursor-pointer"
          >
            {"Next >"}
          </button>
        </div>
      </div>
    </>
  );
}
