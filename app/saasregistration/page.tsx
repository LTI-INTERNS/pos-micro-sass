"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import RegisterAuthLayout from "@/app/components/saas/auth/RegisterAuthLayout";

import { InputField, PasswordField, FormErrorMessage } from "@/app/components/saas/common/FormFields";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";

export default function RegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    pw: false,
    pw2: false,
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const [formError, setFormError] = useState("");

  const errors = useMemo(() => {
    const e: Record<string, string> = {};

    if (!name.trim()) e.name = "Name is required";

    if (!email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";

    if (!pw) e.pw = "Password is required";
    else if (pw.length < 6) e.pw = "Password must be at least 6 characters";

    if (!pw2) e.pw2 = "Confirm password is required";
    else if (pw2 !== pw) e.pw2 = "Passwords do not match";

    return e;
  }, [name, email, pw, pw2]);

  const canSubmit = Object.keys(errors).length === 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");
    setSubmitted(true);

    if (!canSubmit) {
      setFormError("Please fix the errors and try again.");
      return;
    }

    alert("Registered (demo) ✅");
  }

  return (
    <RegisterAuthLayout>
      <h2 className="text-center text-3xl font-bold text-white mb-8">
        Sign Up
      </h2>

      <form onSubmit={onSubmit} className="space-y-5">
        {formError && <FormErrorMessage message={formError} />}

        <InputField
          label="Name"
          placeholder="Coca PVT (LTD)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          error={(submitted || touched.name) ? errors.name : ""}
        />

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

        <PasswordField
          label="Confirm Password"
          placeholder="******"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, pw2: true }))}
          error={(submitted || touched.pw2) ? errors.pw2 : ""}
        />

        <PrimaryButton type="submit" disabled={!canSubmit}>
          Sign Up
        </PrimaryButton>

        <div className="text-center text-sm text-white/70 pt-2">
          Already have an account?{" "}
          <Link href="/saaslogin" className="text-white font-semibold underline">
            Sign In
          </Link>
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
    </RegisterAuthLayout>
  );
}
