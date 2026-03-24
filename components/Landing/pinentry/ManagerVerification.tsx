"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

type ManagerVerificationProps = {
  onVerified: () => void;
  onCancel:   () => void;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export default function ManagerVerification({
  onVerified,
}: ManagerVerificationProps) {
  const { data: session } = useSession();

  const [managerEmail, setManagerEmail]       = useState("");
  const [managerPassword, setManagerPassword] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [loading, setLoading]                 = useState(false);

  const handleManagerVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationError("");
    setLoading(true);

    try {
      // Verify the manager against the backend auth endpoint.
      // We accept MANAGER, OWNER, or ADMIN roles as valid approvers.
      const res = await fetch(`${API}/api/v1/auth/login`, {
        method:  "POST",
        headers: {
          "Content-Type":  "application/json",
          // Pass branch context so the backend can scope the check
          ...(session?.user?.backendToken
            ? { Authorization: `Bearer ${session.user.backendToken}` }
            : {}),
        },
        body: JSON.stringify({
          email:    managerEmail.trim(),
          password: managerPassword,
        }),
      });

      const result = await res.json();

      if (!res.ok || !result.success || !result.data?.ok) {
        setVerificationError("Invalid manager credentials. Please try again.");
        return;
      }

      const role = result.data.role?.toUpperCase();
      if (!["MANAGER", "OWNER", "ADMIN"].includes(role)) {
        setVerificationError("Only managers, owners, or admins can approve this action.");
        return;
      }

      // Optionally: ensure the manager belongs to the same branch
      if (
        session?.user?.branchId &&
        result.data.branchId &&
        result.data.branchId !== session.user.branchId
      ) {
        setVerificationError("Manager does not belong to this branch.");
        return;
      }

      setManagerEmail("");
      setManagerPassword("");
      onVerified();

    } catch {
      setVerificationError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleManagerVerification} className="space-y-5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-5">
          Manager Verification
        </h3>
        <p className="text-sm text-white/70">
          Enter manager credentials to reset PIN
        </p>
      </div>

      {verificationError && (
        <div className="mb-4 text-left">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-white/90">{verificationError}</p>
          </div>
        </div>
      )}

      <div className="text-left">
        <label className="block text-sm font-medium text-white/90 mb-1 mt-10">
          Email Address
        </label>
        <input
          type="email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2 rounded-4xl bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50"
          placeholder="manager@branch.com"
        />
      </div>

      <div className="text-left">
        <label className="block text-sm font-medium text-white/90 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={managerPassword}
            onChange={(e) => setManagerPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-2 pr-10 rounded-4xl bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50"
            placeholder="Enter password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 mt-5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Verifying..." : "Verify"}
      </button>
    </form>
  );
}
