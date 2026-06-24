import { useState, useEffect } from "react";
import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/components/saas/common/GlassBackground";
import BusinessCardGrid from "@/components/saas/businessType/BusinessCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
  completedSteps: number;
  onCanProceedChange?: (can: boolean) => void;
  triggerRef?: React.MutableRefObject<(() => void) | null>;
};

export default function BusinessTypeStep({ data, onNext, onCanProceedChange, triggerRef }: Props) {
  const [selectedType, setSelectedType] = useState<string>(data.businessTypeId);

  const canProceed = selectedType.length > 0;

  // Notify parent whenever canProceed changes
  useEffect(() => {
    onCanProceedChange?.(canProceed);
  }, [canProceed, onCanProceedChange]);

  const handleNext = () => {
    if (!canProceed) return;
    onNext({ businessTypeId: selectedType });
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
            Select Your Business Type
          </h1>

          <BusinessCardGrid
            selected={selectedType}
            onSelect={setSelectedType}
          />
        </div>
      </GlassBackground>
    </>
  );
}