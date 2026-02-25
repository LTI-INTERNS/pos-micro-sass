"use client";

import { useState, useEffect } from "react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import StepProgressBar from "@/components/saas/common/StepProgressBar";

import CompanyCreationStep  from "@/components/saas/companyCreation/CompanyCreationStep";
import BusinessTypeStep     from "@/components/saas/businessType/BusinessTypeStep";
import SubscriptionPlanStep from "@/components/saas/subscriptionPlan/SubscriptionPlanStep";
import PaymentProcessStep   from "@/components/saas/paymentProcess/PaymentProcessStep";
import { useRegistrationPersistence } from "@/app/companyregistration/useRegistrationPersistence";

export type RegistrationData = {
  companyName: string;
  address: string;
  contact: string;
  email: string;
  logo: File | null;
  businessType: string;
  subscriptionPlan: string;
  paymentMethod: "mastercard" | "visa";
  nameOnCard: string;
  cardNumber: string;
  expDate: string;
  cvv: string;
};


const STEPS = [
  { id: "1", label: "Account"      },
  { id: "2", label: "Business"     },
  { id: "3", label: "Subscription" },
  { id: "4", label: "Checkout"     },
];

const DEFAULT_DATA: RegistrationData = {
  companyName: "", address: "", contact: "", email: "", logo: null,
  businessType: "", subscriptionPlan: "",
  paymentMethod: "mastercard", nameOnCard: "", cardNumber: "", expDate: "", cvv: "",
};

export default function RegistrationPage() {
  const { save, load, clear } = useRegistrationPersistence();

  const [currentStep,    setCurrentStep]    = useState(1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(DEFAULT_DATA);
  const [hydrated, setHydrated] = useState(false);

  // Restore from localStorage on first mount
  useEffect(() => {
    const { data, step } = load();
    if (data) {
      setRegistrationData((prev) => ({ ...prev, ...data }));
      // The saved step is the NEXT step the user should be on,
      // so completedSteps = savedStep - 1
      setCompletedSteps(step - 1);
      setCurrentStep(step);
    }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever data or step changes
  useEffect(() => {
    if (hydrated) {
      save(registrationData, currentStep);
    }
  }, [registrationData, currentStep, hydrated, save]);

  // Scroll to top whenever current step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Navigation handlers 
  const handleNext = (stepData: Partial<RegistrationData>) => {
    const merged = { ...registrationData, ...stepData };
    setRegistrationData(merged);
    const nextStep = Math.min(currentStep + 1, STEPS.length);
    // Mark current step as completed
    setCompletedSteps((prev) => Math.max(prev, currentStep));
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

   const handleStepClick = (step: number) => {
    if (step <= completedSteps + 1) {
      setCurrentStep(step);
    }
  };

  const handleComplete = (paymentData: Partial<RegistrationData>) => {
    const finalData = { ...registrationData, ...paymentData };
    console.log("Registration complete:", finalData);
    clear(); 
    alert("Registration Successful!");
  };

  if (!hydrated) return null; 

  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="h-20" />

      <StepProgressBar
        currentStep={currentStep}
        completedSteps={completedSteps}
        steps={STEPS}
        onStepClick={handleStepClick}
      />

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
          completedSteps={completedSteps}
        />
      )}

      {currentStep === 3 && (
        <SubscriptionPlanStep
          data={registrationData}
          onNext={handleNext}
          onBack={handleBack}
          completedSteps={completedSteps}
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