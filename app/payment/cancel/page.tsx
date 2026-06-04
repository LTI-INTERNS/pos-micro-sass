"use client";

import Link from "next/link";
import GlassBackground from "@/components/saas/common/GlassBackground";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function PaymentCancelPage() {
  return (
    <GlassBackground>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-500/20 text-3xl">
            !
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Cancelled</h1>
          <p className="text-white/70 leading-relaxed mb-8">
            Your payment was not completed. You can return to the registration checkout step and try again.
          </p>
          <Link href="/companyregistration">
            <ActionButton className="w-full py-4 text-base">
              Back to Registration
            </ActionButton>
          </Link>
        </div>
      </div>
    </GlassBackground>
  );
}
