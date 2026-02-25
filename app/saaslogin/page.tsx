"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

import { loginAction } from "@/app/saaslogin/auth";

export default function LoginPage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({ email: false, pw: false });

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  const [serverFieldError, setServerFieldError] = useState<{
    email?: string;
    pw?: string;
  }>({});

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
    setSuccess("");

    setServerFieldError({});

    if (!canSubmit) {
      setFormError("Please fix the errors and try again.");
      return;
    }

    const fd = new FormData();
    fd.set("email", email);
    fd.set("password", pw);

    startTransition(async () => {
      const res = await loginAction(fd);

      if (!res.ok) {
        setFormError(res.message);

        if (res.field === "email") setServerFieldError({ email: res.message });
        if (res.field === "password") setServerFieldError({ pw: res.message });

        setTouched({ email: true, pw: true });
        return;
      }
      setSuccess(res.message);
      router.push("/companyregistration");
    });
  }

  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="pt-5 pb-20 px-4">
        <GlassBackground>
          <div>
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
                    {formError && <FormErrorMessage message={formError} />}
                    {success && (
                      <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white">
                        {success}
                      </div>
                    )}

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
                          if (serverFieldError.email) {
                            setServerFieldError((prev) => ({ ...prev, email: undefined }));
                          }
                        }}
                        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                        error={
                          submitted || touched.email
                            ? serverFieldError.email || errors.email
                            : ""
                        }
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
                          if (serverFieldError.pw) {
                            setServerFieldError((prev) => ({ ...prev, pw: undefined }));
                          }
                        }}
                        onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
                        error={
                          submitted || touched.pw
                            ? serverFieldError.pw || errors.pw
                            : ""
                        }
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
                      <Link href="/terms" className="hover:text-white transition">
                        Terms
                      </Link>
                      <Link href="/privacy" className="hover:text-white transition">
                        Privacy
                      </Link>
                    </div>
                  </form>
                </div>
              }
            />
          </div>
        </GlassBackground>
      </div>
    </CommonLayout>
  );
}