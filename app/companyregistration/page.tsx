"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import StepProgressBar from "@/components/saas/common/StepProgressBar";

import CompanyCreationStep  from "@/components/saas/companyCreation/CompanyCreationStep";
import BusinessTypeStep     from "@/components/saas/businessType/BusinessTypeStep";
import SubscriptionPlanStep from "@/components/saas/subscriptionPlan/SubscriptionPlanStep";
import PaymentProcessStep   from "@/components/saas/paymentProcess/PaymentProcessStep";
import { useRegistrationPersistence } from "@/app/companyregistration/useRegistrationPersistence";
import { createCompany } from "@/lib/services/saas-service";

export type RegistrationData = {
  companyName: string;
  address: string;
  contact: string;
  email: string;
  logo: File | null;
  businessTypeId: string;
  subId: string;
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
  businessTypeId: "", subId: "",
  paymentMethod: "mastercard", nameOnCard: "", cardNumber: "", expDate: "", cvv: "",
};

export default function RegistrationPage() {
  const { data: session } = useSession();
  const { save, load, clear } = useRegistrationPersistence();

  const [currentStep,    setCurrentStep]    = useState(1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>(DEFAULT_DATA);
  const [hydrated,  setHydrated]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Restore from localStorage on first mount
  useEffect(() => {
    const { data, step } = load();
    if (data) {
      setRegistrationData((prev) => ({ ...prev, ...data }));
      setCompletedSteps(step - 1);
      setCurrentStep(step);
    }
    setHydrated(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever data or step changes
  useEffect(() => {
    if (hydrated) save(registrationData, currentStep);
  }, [registrationData, currentStep, hydrated, save]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);


  async function submitCompany(data: RegistrationData): Promise<boolean> {
    setSubmitError("");
    setSubmitting(true);

    const result = await createCompany({
      companyName:    data.companyName,
      address:        data.address,
      contactNumber:  data.contact,
      email:          data.email,
      logoUrl:        "",          // logo upload not yet implemented
      businessTypeId: data.businessTypeId,
      subId:          data.subId,
    });

    if (!result.ok) {
      setSubmitError(result.message);
      setSubmitting(false);
      return false;
    }

    await signIn("select-company", {
      redirect:    false,
      companyId:   result.companyId,
      companyName: result.name,
      role:        session?.user?.role         ?? "",
      email:       session?.user?.email        ?? "",
      name:        session?.user?.name         ?? "",
      branchId:    session?.user?.branchId     ?? "",
      branchName:  session?.user?.branchName   ?? "",
      token:       session?.user?.backendToken ?? "",
    });

    setSubmitting(false);
    return true;
  }

  const handleNext = async (stepData: Partial<RegistrationData>) => {
    const merged = { ...registrationData, ...stepData };
    setRegistrationData(merged);
    setCompletedSteps((prev) => Math.max(prev, currentStep));

    if (currentStep === 3) {
      if (merged.subId === "SUB_FREE") {
        const ok = await submitCompany(merged);
        if (ok) {
          clear();
          setSuccessMessage(
            `🎉 "${merged.companyName}" has been created successfully on the Free plan! Redirecting you to your dashboard...`
          );
          setTimeout(() => {
            window.location.href = "/companySelection";
          }, 3000);
        }
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleStepClick = (step: number) => {
    if (step <= completedSteps + 1) setCurrentStep(step);
  };

  const handleComplete = () => {
    clear();
    window.location.href = "/companySelection";
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

      {submitError && (
        <div className="mx-auto max-w-md mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300 text-center">
          {submitError}
        </div>
      )}

      {successMessage && (
        <div className="mx-auto max-w-lg mt-4 px-6 py-4 rounded-xl bg-green-500/15 border border-green-500/30 text-sm text-green-300 text-center">
          {successMessage}
        </div>
      )}

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
          submitting={submitting}
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