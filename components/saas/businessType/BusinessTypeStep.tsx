import { useState } from "react";
import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/components/saas/common/GlassBackground";
import BusinessCardGrid from "@/components/saas/businessType/BusinessCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  completedSteps: number;
};

export default function BusinessTypeStep({ data, onNext, onBack }: Props) {
  const [selectedType, setSelectedType] = useState<string>(data.businessTypeId);

  const canProceed = selectedType.length > 0;

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ businessTypeId: selectedType });
  };

  return (
    <>
      <GlassBackground>
        <div className="container mx-auto py-15">
          <h1 className="text-3xl font-bold text-center text-white mb-20">
            Select Your Business Type
          </h1>

          <BusinessCardGrid
            selected={selectedType}
            onSelect={setSelectedType}
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