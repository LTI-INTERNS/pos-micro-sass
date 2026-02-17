"use client";

import { useState } from "react";
import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";
import StepProgressBar from "@/app/components/saas/common/StepProgressBar";

import CompanyCreationStep from "@/app/components/saas/companyCreation/CompanyCreationStep";
import BusinessTypeStep from "@/app/components/saas/businessType/BusinessTypeStep";
import SubscriptionPlanStep from "@/app/components/saas/subscriptionPlan/SubscriptionPlanStep";
import PaymentProcessStep from "@/app/components/saas/paymentProcess/PaymentProcessStep";

export type RegistrationData = {
  // Company data
  companyName: string;
  address: string;
  contact: string;
  email: string;
  logo: File | null;
  
  // Business type
  businessType: string;
  
  // Subscription
  subscriptionPlan: string;
  
  // Payment
  paymentMethod: "mastercard" | "visa";
  nameOnCard: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
};

const STEPS = [
  { id: "1", label: "Account" },
  { id: "2", label: "Business" },
  { id: "3", label: "Subscription" },
  { id: "4", label: "Checkout" },
];

export default function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    companyName: "",
    address: "",
    contact: "",
    email: "",
    logo: null,
    businessType: "",
    subscriptionPlan: "",
    paymentMethod: "mastercard",
    nameOnCard: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const handleNext = (stepData: Partial<RegistrationData>) => {
    setRegistrationData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleComplete = (paymentData: Partial<RegistrationData>) => {
    const finalData = { ...registrationData, ...paymentData };
    console.log("Registration complete:", finalData);
    // TODO: Submit to API
    alert("Registration Successful!");
  };

  return (
    <CommonLayout navbar={<Navigation />}>
      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      <StepProgressBar currentStep={currentStep} steps={STEPS} />

      {currentStep === 1 && (
        <CompanyCreationStep
          data={registrationData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 2 && (
        <BusinessTypeStep
          data={registrationData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 3 && (
        <SubscriptionPlanStep
          data={registrationData}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === 4 && (
        <PaymentProcessStep
          data={registrationData}
          onComplete={handleComplete}
          onBack={handleBack}
        />
      )}
    </CommonLayout>
  );
}