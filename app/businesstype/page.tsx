"use client";

import React from "react";
import { useRouter } from "next/navigation";

import CommonLayout from "../components/saas/common/CommonLayout";
import GlassBackground from "../components/saas/common/GlassBackground";
import BusinessCardGrid from "../components/saas/businessType/BusinessCardGrid";
import Navigation from "@/app/components/saas/companyCreation/Navigation";
import StepProgressBar from "../components/saas/common/StepProgressBar";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/companycreation");
  };

  const handleNext = () => {
    router.push("/subscription");
  };

  return (
    <CommonLayout navbar={<Navigation />} >
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <StepProgressBar
        currentStep={2}
        steps={[
          { id: "1", label: "Account" },
          { id: "2", label: "Business" },
          { id: "3", label: "Subscription" },
          { id: "4", label: "Checkout" },
        ]}
      />

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
              onClick={handleBack}
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
    </CommonLayout>
  );
};

export default Page;
