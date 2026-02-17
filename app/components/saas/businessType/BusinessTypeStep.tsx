import { RegistrationData } from "@/app/companyregistration/page";
import GlassBackground from "@/app/components/saas/common/GlassBackground";
import BusinessCardGrid from "@/app/components/saas/businessType/BusinessCardGrid";

type Props = {
  data: RegistrationData;
  onNext: (data: Partial<RegistrationData>) => void;
  onBack: () => void;
};

export default function BusinessTypeStep({ data, onNext, onBack }: Props) {
  const handleNext = () => {
    // You can capture the selected business type from BusinessCardGrid
    // For now, just proceed to next step
    onNext({});
  };

  return (
    <>
      <GlassBackground>
        <div className="container mx-auto py-15">
          <h1 className="text-3xl font-bold text-center text-white mb-20">
            Select Your Business Type
          </h1>

          <BusinessCardGrid />
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
