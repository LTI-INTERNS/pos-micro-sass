"use client";

import { useState } from "react";
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

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setError("Both password fields are required");
      return false;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }

    if (!/[a-z]/.test(newPassword)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }

    if (!/[0-9]/.test(newPassword)) {
      setError("Password must contain at least one number");
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) {
      setError("Password must contain at least one special character");
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
        <h2 className="text-xl font-semibold text-white">
          Reset Your Password
        </h2>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            New Password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className={`w-full px-4 py-2 rounded-full bg-white/10 border text-white text-sm placeholder-white/50 transition-colors
              ${
                error
                  ? "border-red-400 focus:border-red-400"
                  : "border-white/20 focus:border-orange-400"
              }
              focus:outline-none`}
            value={newPassword}
            onChange={(e) => {setNewPassword(e.target.value); setError("");}}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-white/90 text-sm font-medium">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            className={`w-full px-4 py-2 rounded-full bg-white/10 border text-white text-sm placeholder-white/50 transition-colors
              ${
                error
                  ? "border-red-400 focus:border-red-400"
                  : "border-white/20 focus:border-orange-400"
              }
              focus:outline-none`}
            value={confirmPassword}
            onChange={(e) => {setConfirmPassword(e.target.value); setError("");}}
          />
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