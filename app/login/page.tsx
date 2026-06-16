"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { ArrowLeft } from "lucide-react";
import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import GlassBackground from "@/components/saas/common/GlassBackground";
import LoginForm from "@/components/Landing/Auth/LoginForm";

// NEW: Import Toast System
import LandingToast from "@/components/saas/common/LandingToast";
import { useLandingToast } from "@/hooks/useLandingToast";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Initialize Toast System
  const { toasts, showToast, dismissToast } = useLandingToast();

  const handleBack = async () => {
    try {
      setLoading(true);

      localStorage.removeItem("isLocked");
      sessionStorage.removeItem("cashier");

      await fetch("/api/branch-session", {
        method: "DELETE",
      });

      await signOut({ redirect: false });
    } catch (error) {
      console.error("BACK BUTTON ERROR:", error);
      showToast("Failed to safely log out. Please refresh the page.", "error");
    } finally {
      router.replace("/saaslanding");
    }
  };

  return (
    <CommonLayout
      navbar={<Navigation title="Welcome to POS System" showLogout={false} />}
    >
      <div className="relative px-4 pb-20">
        <button
          type="button"
          onClick={handleBack}
          disabled={loading}
          className="absolute top-30 left-8 sm:left-6 md:left-16 z-20 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
          {loading ? "Leaving..." : "Back"}
        </button>

        <GlassBackground className="max-w-md mx-auto px-6 md:px-10 py-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center">
              Log In
            </h1>
          </div>

          <div className="mt-8">
            {/* Pass showToast to LoginForm */}
            <LoginForm showToast={showToast} />
          </div>
        </GlassBackground>
      </div>
      
      {/* Render Toast System */}
      <LandingToast toasts={toasts} onDismiss={dismissToast} />
    </CommonLayout>
  );
}