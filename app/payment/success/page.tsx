"use client";

import { useEffect } from "react";
import { clearRegistrationData } from "@/app/companyregistration/useRegistrationPersistence";
import GlassBackground from "@/components/saas/common/GlassBackground";
import PaymentResultPopup from "@/components/saas/paymentProcess/PaymentResultPopup";

export default function PaymentSuccessPage() {
  useEffect(() => {
    clearRegistrationData();
  }, []);

  return (
    <GlassBackground>
      <div className="min-h-[560px]" />
      <PaymentResultPopup type="success" />
    </GlassBackground>
  );
}
