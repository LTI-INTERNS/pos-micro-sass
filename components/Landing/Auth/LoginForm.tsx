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
  const [isLocked, setIsLocked]           = useState(false);
  const [form, setForm]                   = useState({ email: "", password: "" });
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    setIsLocked(localStorage.getItem("isLocked") === "true");
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
        email:    form.email,
        password: form.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        throw new Error("Invalid email or password");
      }

      localStorage.removeItem("isLocked");

      // Fetch the session to read the role returned by NextAuth authorize()
      const sessionRes = await fetch("/api/auth/session");
      const session    = await sessionRes.json();
      const role       = (session?.user?.role as string | undefined)?.toUpperCase();

      switch (role) {
        case "ADMIN": {
          // Check company count — skip selection page if only one company
          try {
            const { companyService } = await import("@/lib/services/company-service");
            const companies = await companyService.getMyCompanies();
            router.push(companies.length === 1 ? "/overview" : "/companySelection");
          } catch {
            // Fallback: let companySelection page handle the error state
            router.push("/companySelection");
          }
          break;
        }
        case "MANAGER":
          // Single-branch role — go straight to dashboard
          router.push("/overview");
          break;
        case "BRANCH_SESSION":
          // Branch credentials matched — cashier must pick their avatar
          router.push("/switchuser");
          break;
        case "CASHIER":
          // Direct cashier login — go straight to POS
          router.push("/posdashboard");
          break;
        default:
          throw new Error("Unrecognised account role. Please contact support.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong. Please try again.");
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
          <a href="/forgotpassword" className="text-sm text-orange-400 hover:underline">
            Forgot password?
          </a>
        </div>

        <ActionButton type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Log in"}
        </ActionButton>

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