"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/landing/Navigation";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import Card from "@/components/saas/common/formCard";
import GlassBackground from "@/components/saas/common/GlassBackground";
import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/components/saas/common/FormFields";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function SaasOwnerLoginPage() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, pw: false });
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

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");

    if (!canSubmit) {
      setFormError("Please fix the errors and try again.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("saas-owner-login", {
        email,
        password: pw,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        setFormError("Invalid email or password.");
        setTouched({ email: true, pw: true });
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role?.toUpperCase();

      if (role !== "SAAS_OWNER") {
        setFormError(
          "Access denied. This portal is for platform admins only."
        );
        return;
      }

      window.location.href = "/saasowner/companies";
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
                    alt="Platform Admin Login"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </Card>
              </div>
            }
            right={
              <div className="w-full max-w-md mx-auto">
                <h2 className="text-center text-3xl font-bold text-white mb-2">
                  Platform Admin
                </h2>
                <p className="text-center text-sm text-white/60 mb-8">
                  Sign in to your SaaS owner console
                </p>

                <form onSubmit={onSubmit} className="space-y-5">
                  {formError && <FormErrorMessage message={formError} />}

                  <div className="space-y-4">
                    <InputField
                      id="so-login-email"
                      label="Email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="admin@platform.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() =>
                        setTouched((t) => ({ ...t, email: true }))
                      }
                      error={
                        submitted || touched.email ? errors.email : ""
                      }
                    />

                    <PasswordField
                      id="so-login-password"
                      label="Password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••"
                      value={pw}
                      onChange={(e) => setPw(e.target.value)}
                      onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
                      error={submitted || touched.pw ? errors.pw : ""}
                    />
                  </div>

                  <ActionButton
                    type="submit"
                    disabled={!canSubmit || isPending}
                  >
                    {isPending ? "Signing in…" : "Sign In"}
                  </ActionButton>

                  <div className="pt-3 flex items-center justify-center gap-8 text-xs text-white/45">
                    <Link href="/terms" className="hover:text-white transition">
                      Terms
                    </Link>
                    <Link
                      href="/privacy"
                      className="hover:text-white transition"
                    >
                      Privacy
                    </Link>
                  </div>
                </form>
              </div>
            }
          />
        </GlassBackground>
      </div>
    </CommonLayout>
  );
}