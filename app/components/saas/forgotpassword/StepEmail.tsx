"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type Props = {
  email: string;
  setEmail: (email: string) => void;
  onNext: () => void;
  onCancel?: () => void;
};

export default function StepEmail({
  email,
  setEmail,
  onNext,
  onCancel,
}: Props) {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  // simple email regex
  const isValidEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleNext = () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    onNext();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      
      router.push("/saaslogin");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-white mb-3">
          Forgot Password?
        </h2>
        <br />
        <br />
        <p className="text-white/80 text-sm">
          No worries, we'll send you reset instructions
        </p>
        <br />
      </div>

      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <label className="text-white/90 text-sm font-medium">
          Email <span className="text-orange-400">*</span>
        </label>

        <input
          type="email"
          placeholder="example@yourdomain.com"
          className={`w-full px-4 py-3 rounded-full bg-white/10 border text-white text-xs placeholder-white/50 transition-colors
            ${
              error
                ? "border-red-400 focus:border-red-400"
                : "border-white/20 focus:border-orange-400"
            }
            focus:outline-none`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError("");
          }}
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-xs mt-1 ml-2">{error}</p>
        )}
        <br />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-2">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth={false}
          onClick={handleCancel}
          className="flex-1 !rounded-full !bg-transparent !border-orange-500/50 !text-orange-400 hover:!bg-orange-500/10"
        />

        <ActionButton
          label="Send Code"
          variant="primary"
          fullWidth={false}
          onClick={handleNext}
          className="flex-1 !rounded-full !bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700"
        />
      </div>
    </div>
  );
}