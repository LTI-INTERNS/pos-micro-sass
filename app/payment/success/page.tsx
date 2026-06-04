"use client";

import Link from "next/link";
import GlassBackground from "@/components/saas/common/GlassBackground";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function PaymentSuccessPage() {
  return (
    <GlassBackground>
      <div className="min-h-screen flex items-center justify-center px-4 py-10 text-white">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 text-3xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold mb-3">Payment Successful</h1>
          <p className="text-white/70 leading-relaxed mb-8">
            Stripe confirmed your payment. Your company will be created by the Stripe webhook. If it does not appear immediately, wait a few seconds and refresh the company selection page.
          </p>
          <Link href="/companyselection">
            <ActionButton className="w-full py-4 text-base">
              Go to Company Selection
            </ActionButton>
          </Link>
        </div>
      </div>
    </GlassBackground>
  );
}
