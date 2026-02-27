"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/components/saas/common/FormFields";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function LoginForm() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    const locked = localStorage.getItem("isLocked") === "true";
    setIsLocked(locked);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false, // handle redirect manually below
      });

      if (!result?.ok || result.error) {
        throw new Error("Invalid email or password");
      }

      localStorage.removeItem("isLocked");
      setIsLocked(false);

      // role-based redirect is handled in next-auth callback
      // default redirect to overview; switchuser for cashier handled server-side
      router.push("/overview");

    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        {isLocked && (
          <div className="text-center text-orange-300 text-sm bg-orange-500/10 border border-orange-400/30 rounded-xl p-3">
            Screen is locked. Please log in to continue.
          </div>
        )}

        {error && <FormErrorMessage message={error} />}

        {/* Input fields */}
        <InputField
          id="login-email"
          label="Email Address"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
        />

        <PasswordField
          id="login-password"
          label="Password"
          name="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
        />

        <div className="flex justify-end">
          <a
            href="/forgotpassword"
            className="text-sm text-orange-400 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <ActionButton type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </ActionButton>

        {/* End user agreement */}
        <div className="text-center text-sm text-white/60 pt-2">
          <button
            type="button"
            onClick={() => setShowAgreement(true)}
            className="hover:underline"
          >
            End user agreement
          </button>
        </div>
      </form>

      {showAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-semibold">End User Agreement</h3>

            <p className="text-sm text-gray-600">
              This system is for authorized employees only. By continuing, you
              agree to follow company policies, maintain data confidentiality,
              and use the system responsibly.
            </p>

            <button
              type="button"
              onClick={() => setShowAgreement(false)}
              className="w-full bg-orange-600 text-white rounded-xl py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}