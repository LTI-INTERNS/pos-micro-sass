"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import Navigation from "@/app/components/saas/landing/Navigation";
import Footer from "@/app/components/saas/common/Footer";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/app/components/saas/common/FormFields";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";

export default function LoginPage() {
  // form state
  const [submitted, setSubmitted] = useState(false);

  const [touched, setTouched] = useState({
    email: false,
    pw: false,
  });

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [formError, setFormError] = useState("");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

    if (!pw) e.pw = "Password is required";
    else if (pw.length < 6) e.pw = "Password must be at least 6 characters";

    return e;
  }, [email, pw]);

  const canSubmit = Object.keys(errors).length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitted(true);

    if (!canSubmit) {
      setFormError("Please fix the errors and try again.");
      return;
    }

    // TODO: call your login API here
    // await fetch("/api/login", { method: "POST", body: JSON.stringify({ email, password: pw }) })

    alert("Logged in (demo) ✅");
  }

  return (
        <>
        <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center">
          <Navigation/>
    <GlassBackground backgroundImage="/saasbackground.png">
      <SplitPanelLayout
        left={
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-xl rounded-2xl overflow-hidden bg-orange-500/10">
              {/* Use your real image path here */}
              <img
                src="/login logo.png"
                alt="Login illustration"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        }
        right={
          <div className="w-full max-w-md">
            <h2 className="text-center text-3xl font-bold text-white mb-8">
              Sign In
            </h2>

            <form onSubmit={onSubmit} className="space-y-5">
              {formError && <FormErrorMessage message={formError} />}

              <InputField
                label="Email"
                placeholder="ABC123@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                error={(submitted || touched.email) ? errors.email : ""}
              />

              <PasswordField
                label="Password"
                placeholder="******"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
                error={(submitted || touched.pw) ? errors.pw : ""}
              />

              <PrimaryButton type="submit" disabled={!canSubmit}>
                Sign In
              </PrimaryButton>

              <div className="text-center text-sm text-white/70 pt-2 space-y-2">
                <p>
                  Don’t have an account?{" "}
                  <Link
                    href="/saasregistration"
                    className="text-white font-semibold underline"
                  >
                    Sign Up
                  </Link>
                </p>

                <p>
                  <Link href="/forgot-password" className="hover:text-white underline">
                    Forget Password?
                  </Link>
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 text-xs text-white/60">
                <Link href="/terms" className="hover:text-white">
                  Terms of Services
                </Link>
                <Link href="/privacy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </div>
            </form>
          </div>
        }
      />
    </GlassBackground>
    </div>
      <Footer/>
    </>
  );
}
