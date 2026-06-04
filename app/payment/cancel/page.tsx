"use client";

import GlassBackground from "@/components/saas/common/GlassBackground";
import PaymentResultPopup from "@/components/saas/paymentProcess/PaymentResultPopup";

export default function PaymentCancelPage() {
  return (
    <GlassBackground>
      <div className="min-h-[560px]" />
      <PaymentResultPopup type="cancel" />
    </GlassBackground>
  );
}
