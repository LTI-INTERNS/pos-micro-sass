"use client";

import React, { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";


import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navbar from "@/app/components/saas/common/Navbar";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import Card from "@/app/components/saas/common/formCard";

import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/app/components/saas/common/FormFields";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";

import { loginAction } from "./auth";

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
 
        
          router.push("/companyCreation");
         
    });
  }

  return (
    <CommonLayout
      navbar={
        <Navbar
          logoSrc="/logo.png"
          middleContent={
            <>
              <Link className="hover:text-orange-300 transition" href="/">
                Home
              </Link>
              <Link className="hover:text-orange-300 transition" href="/about">
                About
              </Link>
              <Link className="hover:text-orange-300 transition" href="/features">
                Features
              </Link>
              <Link className="hover:text-orange-300 transition" href="/growth">
                Growth
              </Link>
              <Link
                className="hover:text-orange-300 transition"
                href="/testimonials"
              >
                Testimonials
              </Link>
            </>
          }
          rightContent={
            <>
              <Link
                href="/saaslogin"
                className="px-5 py-2 rounded-full border border-orange-400/70 text-white text-sm font-semibold hover:bg-white/10 transition"
              >
                Sign In
              </Link>
              <Link
                href="/saasregistration"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold hover:brightness-110 transition"
              >
                Sign Up
              </Link>
            </>
          }
        />
      }
    >
      {/*space under fixed navbar */}
      <div className="pt-24 pb-20 px-4">
        <div className="mx-auto max-w-6xl rounded-3xl border border-white/30 bg-black/40 backdrop-blur-md shadow-[0_0_40px_rgba(255,115,0,0.15)]">
          <div className="p-10">
            <SplitPanelLayout
              showDivider
              left={
                <div className="flex items-center justify-center w-full">
                  <Card
                    variant="solid"
                    padding="lg"
                    className="w-[420px] h-[460px] rounded-3xl bg-gradient-to-b from-orange-500 to-orange-600 flex items-center justify-center shadow-xl"
                  >
                    <img
                      src="/logIn.png"
                      alt="Login Illustration"
                      className="w-[300px] h-auto object-contain"
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

                    <PrimaryButton type="submit" disabled={!canSubmit || isPending}>
                      {isPending ? "Signing In..." : "Sign In"}
                    </PrimaryButton>

                    <div className="pt-3 text-center text-sm text-white/60 space-y-2">
                      <p>
                        Don’t have an account?{" "}
                        <Link
                          href="/saasregistration"
                          className="text-white font-semibold hover:text-orange-300 transition"
                        >
                          Sign Up
                        </Link>
                      </p>

                      <p>
                        <Link
                          href="/forgot-password"
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
        </div>
      </div>
    </CommonLayout>
  );
}
