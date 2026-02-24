"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type Props = {
  onUpdate: () => void;
  onCancel: () => void;
};

export default function StepPassword({
  onUpdate,
  onCancel,
}: Props) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return false;
    }

   const passwordRegex =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, including an uppercase letter, a lowercase letter, a number, and a special character"
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    setError("");
    return true;
  };

  const handleUpdate = () => {
    if (!validatePassword()) return;

    // UPDATE PASSWORD LOGIC (to be implemented)
    // -------------------------------------------
    // Example:
    // updatePassword(newPassword)
    //   .then(() => onUpdate())
    //   .catch(() => setError("Failed to update password"));

    // TEMP: assume success
    onUpdate();
  };


  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-semibold text-white">
          Reset Your Password
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            New Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new password"
              className={`w-full px-4 py-3 pr-12 rounded-full bg-white/10 border text-white text-sm placeholder-white/50 transition-colors
                ${
                  error
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/20 focus:border-orange-400"
                }
                focus:outline-none`}
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm password"
              className={`w-full px-4 py-3 pr-12 rounded-full bg-white/10 border text-white text-sm placeholder-white/50 transition-colors
                ${
                  error
                    ? "border-red-400 focus:border-red-400"
                    : "border-white/20 focus:border-orange-400"
                }
                focus:outline-none`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError("");
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs text-center mt-1">
          {error}
        </p>
      )}

      <div className="flex gap-3 mt-8">
        <ActionButton
          label="Cancel"
          variant="outline"
          fullWidth={false}
          onClick={onCancel}
          className="flex-1 !rounded-full !bg-transparent !border-orange-500/50 !text-orange-400 hover:!bg-orange-500/10"
        />
        <ActionButton
          label="Update Password"
          variant="primary"
          fullWidth={false}
          onClick={handleUpdate}
          className="flex-1 !rounded-full !bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700"
        />
      </div>
    </div>
  );
}