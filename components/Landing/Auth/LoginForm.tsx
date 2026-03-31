"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { signIn } from "next-auth/react";
import {
  InputField,
  PasswordField,
  FormErrorMessage,
} from "@/components/saas/common/FormFields";
import ActionButton from "@/components/Admin/common/ActionButton";

export default function LoginForm() {
  const [isLocked, setIsLocked] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    setIsLocked(localStorage.getItem("isLocked") === "true");
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const clearBranchSession = async () => {
    try {
      await fetch("/api/branch-session", { method: "DELETE" });
    } catch {
      // ignore
    }
  };

const saveBranchSession = async (session: {
  user?: {
    branchId?: string;
    branchName?: string;
    companyId?: string;
    companyName?: string;
    backendToken?: string;
  };
}) => {
  console.log("SENDING TO BRANCH SESSION API:", {
    branchId: session?.user?.branchId,
    branchName: session?.user?.branchName,
    companyId: session?.user?.companyId,
    companyName: session?.user?.companyName,
    backendToken: session?.user?.backendToken ? "[present]" : "[missing]",
  });

  const res = await fetch("/api/branch-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      branchId: session?.user?.branchId ?? "",
      branchName: session?.user?.branchName ?? "",
      companyId: session?.user?.companyId ?? "",
      companyName: session?.user?.companyName ?? "",
      backendToken: session?.user?.backendToken ?? "",
    }),
  });

  const data = await res.json();
  console.log("BRANCH SESSION RESPONSE:", data);

  if (!res.ok) {
    throw new Error(data?.error || "Failed to create branch session");
  }
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (!result?.ok || result.error) {
        throw new Error("Invalid email or password");
      }

      localStorage.removeItem("isLocked");

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      console.log("SESSION DEBUG:", session);
      const role = (session?.user?.role as string | undefined)?.toUpperCase();

      switch (role) {
        case "ADMIN": {
          await clearBranchSession();

          try {
            const companiesRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/v1/auth/companies`,
              { headers: { Authorization: `Bearer ${session?.user?.backendToken}` } }
            );

            const companiesData = await companiesRes.json();
            const companies: { companyId: string; name: string }[] = companiesData?.data ?? [];

            if (companies.length === 1) {
              const only = companies[0];

              await signIn("select-company", {
                redirect: false,
                companyId: only.companyId,
                companyName: only.name,
                role: session?.user?.role ?? "",
                email: session?.user?.email ?? "",
                name: session?.user?.name ?? "",
                branchId: session?.user?.branchId ?? "",
                branchName: session?.user?.branchName ?? "",
                token: session?.user?.backendToken ?? "",
              });

              window.location.href = "/overview";
              return;
            }
          } catch {
            // ignore and continue
          }

          window.location.href = "/companyselection";
          break;
        }

        case "MANAGER":
          await clearBranchSession();
          window.location.href = "/overview";
          break;

        case "BRANCH_SESSION":
          await saveBranchSession(session);
          window.location.href = "/switchuser";
          break;

        case "CASHIER":
          await clearBranchSession();
          window.location.href = "/posdashboard";
          break;

        default:
          await clearBranchSession();
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