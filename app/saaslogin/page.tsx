"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

import CommonLayout    from "@/components/saas/common/CommonLayout";
import Navigation      from "@/components/saas/landing/Navigation";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import Card            from "@/components/saas/common/formCard";
import GlassBackground from "@/components/saas/common/GlassBackground";
import {
  InputField,
  PasswordField,
} from "@/components/saas/common/FormFields";
import ActionButton from "@/components/Admin/common/ActionButton";

// NEW: Import Toast System
import LandingToast from "@/components/saas/common/LandingToast";
import { useLandingToast } from "@/hooks/useLandingToast";

export default function SaasLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted]    = useState(false);
  const [touched, setTouched]        = useState({ email: false, pw: false });
  const [email, setEmail]            = useState("");
  const [pw, setPw]                  = useState("");
  
  // Initialize Toast
  const { toasts, showToast, dismissToast } = useLandingToast();

  const [serverFieldError, setServerFieldError] = useState<{
    email?: string;
    pw?: string;
  }>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!email.trim())                    e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!pw)                              e.pw = "Password is required";
    else if (pw.length < 6)              e.pw = "Password must be at least 6 characters";
    return e;
  }, [email, pw]);

  const canSubmit = Object.keys(errors).length === 0;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setServerFieldError({});

    if (!canSubmit) {
      showToast("Please fix the errors and try again.", "error");
      return;
    }

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password: pw,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        showToast("Invalid email or password", "error");
        setTouched({ email: true, pw: true });
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session    = await sessionRes.json();
      const role       = session?.user?.role?.toUpperCase();

      if (role !== "OWNER") {
        showToast("This login is for owners only. Please use the staff login page.", "error");
        return;
      }

      try {
        const companiesRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/v1/auth/companies`,
          { headers: { Authorization: `Bearer ${session.user.backendToken}` } }
        );
        const companiesData = await companiesRes.json();
        const hasCompanies  = (companiesData?.data?.length ?? 0) > 0;
        window.location.href = hasCompanies ? "/companyselection" : "/companyregistration";
      } catch {
        window.location.href = "/companyselection";
      }
    });
  }

  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="pt-5 pb-20 px-4">
        <GlassBackground>
          <SplitPanelLayout
            showDivider
            left={
              <div className="flex items-center justify-center w-full">
                <Card
                  variant="solid"
                  padding="lg"
                  className="w-[420px] h-[460px] rounded-3xl bg-gradient-to-b from-orange-500 to-orange-600 flex items-center justify-center shadow-xl"
                >
                  <Image
                    src="/saas/logIn.png"
                    alt="Login Illustration"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </Card>
              </div>
            }
            right={
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-center text-3xl font-bold text-white mb-8">
                  Sign In
                </h2>

                <form onSubmit={onSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <InputField
                      id="login-email"
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="ABC123@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (serverFieldError.email)
                          setServerFieldError((prev) => ({ ...prev, email: undefined }));
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                      error={submitted || touched.email ? serverFieldError.email || errors.email : ""}
                    />

                    <PasswordField
                      id="login-password"
                      label="Password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="******"
                      value={pw}
                      onChange={(e) => {
                        setPw(e.target.value);
                        if (serverFieldError.pw)
                          setServerFieldError((prev) => ({ ...prev, pw: undefined }));
                      }}
                      onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
                      error={submitted || touched.pw ? serverFieldError.pw || errors.pw : ""}
                    />
                  </div>

                  <ActionButton type="submit" disabled={!canSubmit || isPending}>
                    {isPending ? "Signing In..." : "Sign In"}
                  </ActionButton>

                  <div className="pt-3 text-center text-sm text-white/60 space-y-2">
                    <p>
                      Don&apos;t have an account?{" "}
                      <Link
                        href="/saasregistration"
                        className="text-white font-semibold hover:text-orange-300 transition"
                      >
                        Sign Up
                      </Link>
                    </p>
                    <p>
                      <Link
                        href="/forgotpassword"
                        className="hover:text-white underline underline-offset-4"
                      >
                        Forget Password?
                      </Link>
                    </p>
                  </div>

                  <div className="pt-3 flex items-center justify-center gap-8 text-xs text-white/45">
                    <Link href="/terms"   className="hover:text-white transition">Terms</Link>
                    <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
                  </div>
                </form>
              </div>
            }
          />
        </GlassBackground>
      </div>

      {/* Render Toast System */}
      <LandingToast toasts={toasts} onDismiss={dismissToast} />
    </CommonLayout>
  );
}