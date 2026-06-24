"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import StepProgressBar from "@/components/saas/common/StepProgressBar";

import CompanyCreationStep  from "@/components/saas/companyCreation/CompanyCreationStep";
import BusinessTypeStep     from "@/components/saas/businessType/BusinessTypeStep";
import SubscriptionPlanStep from "@/components/saas/subscriptionPlan/SubscriptionPlanStep";
import PaymentProcessStep   from "@/components/saas/paymentProcess/PaymentProcessStep";
import { useRegistrationPersistence } from "@/app/companyregistration/useRegistrationPersistence";
import PaymentResultPopup from "@/components/saas/paymentProcess/PaymentResultPopup";

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
};

// Steps where the parent renders a Next button (step 1 uses form submit inside the component)
const STEPS_WITH_PARENT_NEXT = [2, 3];

export default function RegistrationPage() {
    const { data: session } = useSession();
    const userId = session?.user?.userId ?? null;

    const { save, load, clear } = useRegistrationPersistence(userId);

    const [currentStep,      setCurrentStep]      = useState(1);
    const [completedSteps,   setCompletedSteps]   = useState(0);
    const [registrationData, setRegistrationData] = useState<RegistrationData>(DEFAULT_DATA);
    const [hydrated,         setHydrated]         = useState(false);
    const [showPaymentCancel, setShowPaymentCancel] = useState(false);

    // Tracks whether the active step's selection is valid (for steps 2 & 3)
    const [stepCanProceed, setStepCanProceed] = useState(false);

    // Ref that step components (2 & 3) write their handleNext into
    const stepTriggerRef = useRef<(() => void) | null>(null);

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

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("paymentStatus") === "cancel") {
            setShowPaymentCancel(true);
            setCurrentStep(4);
            setCompletedSteps((prev) => Math.max(prev, 3));
        }
    }, []);

    const closePaymentCancelPopup = () => {
        setShowPaymentCancel(false);
        const url = new URL(window.location.href);
        url.searchParams.delete("paymentStatus");
        routerReplace(`${url.pathname}${url.search}`);
    };

    const routerReplace = (path: string) => {
        window.history.replaceState(null, "", path);
    };

    // Persist whenever data or step changes
    useEffect(() => {
        if (hydrated) save(registrationData, currentStep);
    }, [registrationData, currentStep, hydrated, save]);

    // Scroll to top on step change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentStep]);

    // Reset canProceed when changing steps
    useEffect(() => {
        setStepCanProceed(false);
        stepTriggerRef.current = null;
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

    // Called by parent Next button — delegates to the step component's own logic
    const handleParentNext = () => {
        stepTriggerRef.current?.();
    };

    const onCanProceedChange = useCallback((can: boolean) => {
        setStepCanProceed(can);
    }, []);

    if (!hydrated) return null;

    const showBack = currentStep > 1;
    const showNext = STEPS_WITH_PARENT_NEXT.includes(currentStep);

    const BackButton = () =>
        showBack ? (
            <button
                id="reg-back-btn"
                onClick={handleBack}
                className="font-semibold hover:opacity-80 cursor-pointer text-white"
                aria-label="Go to previous step"
            >
                {"< Back"}
            </button>
        ) : null;

    const NextButton = () =>
        showNext ? (
            <button
                id="reg-next-btn"
                onClick={handleParentNext}
                disabled={!stepCanProceed}
                className={`font-semibold transition-opacity text-white ${
                    stepCanProceed
                        ? "hover:opacity-80 cursor-pointer"
                        : "opacity-40 cursor-not-allowed"
                }`}
                aria-label="Go to next step"
            >
                {"Next >"}
            </button>
        ) : null;

    return (
        <CommonLayout navbar={<Navigation />}>
            <div className="h-20" />

            {/* ← Back to Company Selection */}
            <div className="w-full px-4 sm:px-6 md:px-10 pt-2 pb-1">
                <a
                    href="/companyselection"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-orange-400 transition-colors duration-200 group"
                    aria-label="Back to company selection"
                >
                    <svg
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                    <span className="hidden sm:inline">Company Selection</span>
                    <span className="sm:hidden">Back</span>
                </a>
            </div>

            <StepProgressBar
                currentStep={currentStep}
                completedSteps={completedSteps}
                steps={STEPS}
                onStepClick={handleStepClick}
            />

            {/*
              ── Desktop layout: step content flanked by Back (left) and Next (right) ──
              ── Mobile: no side buttons; sticky bottom bar shown instead ───────────────
            */}
            <div className="relative w-full">

                {/* LEFT side button — desktop only */}
                {showBack && (
                    <div className="hidden md:flex absolute left-4 lg:left-8 xl:left-16 top-1/2 -translate-y-1/2 z-10">
                        <BackButton />
                    </div>
                )}

                {/* RIGHT side button — desktop only */}
                {showNext && (
                    <div className="hidden md:flex absolute right-4 lg:right-8 xl:right-16 top-1/2 -translate-y-1/2 z-10">
                        <NextButton />
                    </div>
                )}

                {/* Step content */}
                {currentStep === 1 && (
                    <CompanyCreationStep
                        data={registrationData}
                        onNext={handleNext}
                    />
                )}

                {currentStep === 2 && (
                    <BusinessTypeStep
                        data={registrationData}
                        onNext={handleNext}
                        onBack={handleBack}
                        completedSteps={completedSteps}
                        onCanProceedChange={onCanProceedChange}
                        triggerRef={stepTriggerRef}
                    />
                )}

                {currentStep === 3 && (
                    <SubscriptionPlanStep
                        data={registrationData}
                        onNext={handleNext}
                        onBack={handleBack}
                        completedSteps={completedSteps}
                        onCanProceedChange={onCanProceedChange}
                        triggerRef={stepTriggerRef}
                    />
                )}

                {currentStep === 4 && (
                    <PaymentProcessStep
                        data={registrationData}
                        onComplete={handleComplete}
                    />
                )}
            </div>

            {/* Mobile navigation row — centered row below step content, original style */}
            {(showBack || showNext) && (
                <div className="md:hidden mt-10 flex items-center justify-center mb-20 px-6">
                    <div className="flex w-full max-w-xl items-center justify-between text-white">
                        {showBack ? <BackButton /> : <span />}
                        {showNext ? <NextButton /> : <span />}
                    </div>
                </div>
            )}

            <div className="h-10" />

            {showPaymentCancel && (
                <PaymentResultPopup
                    type="cancel"
                    onClose={closePaymentCancelPopup}
                />
            )}
        </CommonLayout>
    );
}