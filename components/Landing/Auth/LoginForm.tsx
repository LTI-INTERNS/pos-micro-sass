"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/app/components/saas/common/FormFields";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type LoginResponse =
  | {
      ok: true;
      role: "admin" | "cashier" | "superadmin";
      emailVerified: boolean;
      email: string;
    }
  | { ok: false; message: string };

export default function LoginForm() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  const [needsVerify, setNeedsVerify] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    const locked = localStorage.getItem("isLocked") === "true";
    setIsLocked(locked);
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setNeedsVerify(false);
    setResendMsg("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setResendMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok || (data.ok === false && "message" in data)) {
        throw new Error(data.ok === false ? data.message : "Login failed");
      }

      if (
        data.ok &&
        (data.role === "admin" || data.role === "cashier") &&
        !data.emailVerified
      ) {
        setNeedsVerify(true);
        setPendingEmail(data.email);
        setError("Your email is not verified. Please verify to continue.");
        return;
      }

      localStorage.removeItem("isLocked");
      setIsLocked(false);

      switch (data.ok ? data.role : "") {
        case "superadmin":
        case "admin":
          router.push("/overview");
          break;
        case "cashier":
          router.push("/switchuser");
          break;
        default:
          router.push("/switchuser");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!pendingEmail) return;

    setResendLoading(true);
    setResendMsg("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });

      const data: { message?: string } = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      setResendMsg("Verification email sent. Please check your inbox.");
    } catch (err: unknown) {
      if (err instanceof Error) setResendMsg(err.message);
      else setResendMsg("Something went wrong");
    } finally {
      setResendLoading(false);
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

        {needsVerify && (
          <div className="bg-white/10 border border-white/20 rounded-2xl p-4 text-sm text-white space-y-2">
            <p>
              Please verify your email:
              <span className="block font-semibold mt-1">{pendingEmail}</span>
            </p>

            <button
              type="button"
              disabled={resendLoading}
              onClick={resendVerification}
              className="text-orange-400 font-medium hover:underline disabled:opacity-60"
            >
              {resendLoading ? "Sending..." : "Resend verification email"}
            </button>

            {resendMsg && <p className="text-xs text-white/70">{resendMsg}</p>}
          </div>
        )}

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