"use client";

import { useState } from "react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/landing/Navigation";
import GlassBackground from "@/components/saas/common/GlassBackground";

import StepEmail from "@/components/saas/forgotpassword/StepEmail";
import StepCode from "@/components/saas/forgotpassword/StepCode";
import StepPassword from "@/components/saas/forgotpassword/StepPassword";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleUpdatePassword = () => alert("Password updated!");

  return (
    <CommonLayout navbar={<Navigation />} >
      <GlassBackground className="mx-auto max-w-md p-20 pt-10 pb-10">
        {step === 1 && (
          <StepEmail email={email} setEmail={setEmail} onNext={() => setStep(2)} />
        )}
        {step === 2 && (
          <StepCode 
            email={email} 
            onNext={() => setStep(3)} 
            onBack={() => setStep(1)} 
          />
        )}
        {step === 3 && (
          <StepPassword
            onUpdate={handleUpdatePassword}
            onCancel={() => setStep(1)}
          />
        )}
      </GlassBackground>
    </CommonLayout>
  );
}