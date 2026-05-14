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
    logoUrl: string;
    logoPublicId: string;
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
    companyName: "", address: "", contact: "", email: "", logo: null, logoUrl: "", logoPublicId: "",
    businessTypeId: "", subId: "",
    paymentMethod: "mastercard", nameOnCard: "", cardNumber: "", expDate: "", cvv: "",
};

export default function RegistrationPage() {
    const { save, load, clear } = useRegistrationPersistence();

    const [currentStep,      setCurrentStep]      = useState(1);
    const [completedSteps,   setCompletedSteps]   = useState(0);
    const [registrationData, setRegistrationData] = useState<RegistrationData>(DEFAULT_DATA);
    const [hydrated,         setHydrated]         = useState(false);

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


    const handleNext = (stepData: Partial<RegistrationData>) => {
        const merged = { ...registrationData, ...stepData };
        setRegistrationData(merged);
        setCompletedSteps((prev) => Math.max(prev, currentStep));
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
        window.location.href = "/companyselection";
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