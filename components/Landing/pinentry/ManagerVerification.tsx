"use client";

import { useState } from "react";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

type ManagerVerificationProps = {
  onVerified: () => void;
  onCancel: () => void;
};

// Mock manager credentials - replace with actual authentication
const MANAGER_CREDENTIALS = {
  email: "manager@example.com",
  password: "manager123",
};

export default function ManagerVerification({
  onVerified,
}: ManagerVerificationProps) {
  const [managerEmail, setManagerEmail] = useState<string>("");
  const [managerPassword, setManagerPassword] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleManagerVerification = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify manager credentials
    if (
      managerEmail === MANAGER_CREDENTIALS.email &&
      managerPassword === MANAGER_CREDENTIALS.password
    ) {
      setVerificationError("");
      setManagerEmail("");
      setManagerPassword("");
      onVerified();
    } else {
      setVerificationError("Invalid manager credentials. Please try again.");
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

      {/* Email */}
      <div className="text-left">
        <label className="block text-sm font-medium text-white/90 mb-1 mt-10">
          Email Address
        </label>
        <input
          type="email"
          value={managerEmail}
          onChange={(e) => setManagerEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-4xl bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          placeholder="manager@example.com"
        />
      </div>

      {/* Password */}
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
            className="w-full px-4 py-2 pr-10 rounded-4xl bg-white/10 backdrop-blur-md border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
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
        className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 mt-5"
      >
        Verify
      </button>
    </form>
  );
}