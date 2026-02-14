"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/landing/Navigation";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import Card from "@/app/components/saas/common/formCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/app/components/saas/common/FormFields";

import { registerAction } from "./auth";

type RegisterFields = "name" | "email" | "password" | "confirmPassword";

export default function RegisterPage() {
  const [isPending, startTransition] = useTransition();

  const [submitted, setSubmitted] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");

  // ✅ FIX: correct typing for server field errors (prevents `[res.field]` TS error)
  const [serverFieldError, setServerFieldError] = useState<
    Partial<Record<RegisterFields, string>>
  >({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!name.trim()) e.name = "Name is required";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";

    if (!confirmPassword) e.confirmPassword = "Confirm password is required";
    else if (confirmPassword !== password) e.confirmPassword = "Passwords do not match";

    return e;
  }, [name, email, password, confirmPassword]);

  const canSubmit = Object.keys(errors).length === 0;

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setFormError("");
    setSuccess("");

    // clear old server errors on new submit
    setServerFieldError({});

    if (!canSubmit) {
      setFormError("Please fix the errors and try again.");
      return;
    }

    const fd = new FormData();
    fd.set("name", name);
    fd.set("email", email);
    fd.set("password", password);
    fd.set("confirmPassword", confirmPassword);

    startTransition(async () => {
      const res = await registerAction(fd);

      if (!res.ok) {
        setFormError(res.message);

        // ✅ show field error under correct input (typed safe)
        const field = res.field as RegisterFields | undefined;
        if (field) {
          setServerFieldError((prev) => ({
            ...prev,
            [field]: res.message,
          }));
          setTouched({
            name: true,
            email: true,
            password: true,
            confirmPassword: true,
          });
        }

        return;
      }

      setSuccess(res.message);

      // optional redirect after success
      // window.location.href = "/saaslogin";
    });
  }

  return (
    <CommonLayout navbar={<Navigation />} >
      {/*space under fixed navbar */}
      <div className="pt-24 pb-20 px-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/30 bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(255,115,0,0.15)]">
          <div>
            <SplitPanelLayout
              showDivider
              left={
                <div className="flex items-center justify-center w-full">
                  {/* Left promo card */}
                  <Card variant="gradient" padding="lg" radius="2xl" className="w-full max-w-md">
                    <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                      Start your POS <br />
                      journey today.
                    </h1>

                    <p className="mt-6 text-white/90 text-sm leading-6">
                      Running a retail business is easier with LankaTech POS. We help you sell better,
                      manage your entire business, and join the digital revolution.
                    </p>

                    <div className="mt-8 h-px w-full bg-white/40" />

                    <div className="mt-8">
                      <h3 className="text-2xl font-bold">Need assistance?</h3>
                      <div className="mt-4 text-white/90 text-sm leading-6">
                        <p>+94 123 456 789</p>
                        <p>info@lankatechinnovations.com</p>
                      </div>
                    </div>
                  </Card>
                </div>
              }
              right={
                <div className="w-full max-w-md mx-auto">
                  <h2 className="text-center text-3xl font-bold text-white mb-8">
                    Sign Up
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
                        id="reg-name"
                        label="Name"
                        name="name"
                        required
                        autoComplete="name"
                        placeholder="ABC PVT (LTD)"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (serverFieldError.name) {
                            setServerFieldError((prev) => ({ ...prev, name: undefined }));
                          }
                        }}
                        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                        error={
                          submitted || touched.name
                            ? serverFieldError.name || errors.name
                            : ""
                        }
                      />

                      <InputField
                        id="reg-email"
                        label="Email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="abc123@gmail.com"
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
                        id="reg-password"
                        label="Password"
                        name="password"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (serverFieldError.password) {
                            setServerFieldError((prev) => ({ ...prev, password: undefined }));
                          }
                        }}
                        onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                        error={
                          submitted || touched.password
                            ? serverFieldError.password || errors.password
                            : ""
                        }
                      />

                      <PasswordField
                        id="reg-confirm-password"
                        label="Confirm Password"
                        name="confirmPassword"
                        required
                        autoComplete="new-password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (serverFieldError.confirmPassword) {
                            setServerFieldError((prev) => ({
                              ...prev,
                              confirmPassword: undefined,
                            }));
                          }
                        }}
                        onBlur={() =>
                          setTouched((t) => ({ ...t, confirmPassword: true }))
                        }
                        error={
                          submitted || touched.confirmPassword
                            ? serverFieldError.confirmPassword || errors.confirmPassword
                            : ""
                        }
                      />
                    </div>

                    <PrimaryButton type="submit" disabled={!canSubmit || isPending}>
                      {isPending ? "Signing Up..." : "Sign Up"}
                    </PrimaryButton>

                    <div className="pt-3 text-center text-sm text-white/60 space-y-2">
                      <p>
                        Already have an account?{" "}
                        <Link
                          href="/saaslogin"
                          className="text-white font-semibold hover:text-orange-300 transition"
                        >
                          Sign In
                        </Link>
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-8 text-xs text-white/45">
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
        </div>
      </div>
    </CommonLayout>
  );
}
