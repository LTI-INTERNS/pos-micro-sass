"use client";

import { useState, useRef, useEffect } from "react";
import ActionButton from "@/app/components/Admin/common/ActionButton";

type Props = {
  email: string;
  onNext: () => void;
  onBack?: () => void;
};

export default function StepCode({ email, onNext, onBack }: Props) {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(45);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const digits = pastedData.match(/\d/g);

    if (digits) {
      const newCode = [...code];
      digits.slice(0, 6).forEach((digit, idx) => {
        newCode[idx] = digit;
      });
      setCode(newCode);
      setError("");

      const nextIndex = Math.min(digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) {
      setError(`Please wait ${timer} seconds before resending the code.`);
      return;
    }

    setCode(["", "", "", "", "", ""]);
    setTimer(45);
    setError("");
    inputRefs.current[0]?.focus();

    // RESEND CODE LOGIC (to be implemented)
    // Example:
    // sendVerificationCode(email);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleVerify = () => {
    const enteredCode = code.join("");

    if (!enteredCode || enteredCode.length < 6) {
      setError("Please enter the 6-digit verification code");
      return;
    }

    setError("");

    // VERIFY CODE LOGIC (to be implemented)
    // For now, assume success:
    onNext();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center mb-2 relative">
        {onBack && (
          <button
            onClick={onBack}
            className="absolute left-0 top-0 ml-[-50] text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        )}
        <h2 className="text-2xl font-semibold text-white mb-3">
          Enter Verification Code
        </h2>
      </div>

      <div className="flex justify-center mt-[-20]">
        <svg width="50" viewBox="0 0 68 51" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M68.0022 3.689C68.003 4.29678 67.8533 4.89531 67.5666 5.4312C67.2798 5.9671 66.865 6.42371 66.3589 6.76033L34.0022 28.3333L1.64556 6.76033C0.985978 6.32149 0.485188 5.68197 0.217301 4.93641C-0.0505871 4.19084 -0.0713395 3.37884 0.158114 2.62056C0.387568 1.86228 0.855037 1.19801 1.49135 0.726056C2.12766 0.254097 2.899 -0.000478493 3.69123 6.75187e-07H64.3189C66.3589 6.75187e-07 68.0079 1.65467 68.0079 3.689M68.0079 16.813V45.3333C68.0079 46.8362 67.4109 48.2776 66.3482 49.3403C65.2855 50.403 63.8441 51 62.3412 51H5.67456C4.17167 51 2.73033 50.403 1.66763 49.3403C0.60492 48.2776 0.00789836 46.8362 0.00789836 45.3333V16.813C0.00789836 15.6797 1.27156 15.0053 2.21223 15.6343L34.0022 36.8333L65.7979 15.64C66.0109 15.4975 66.2585 15.4155 66.5144 15.4026C66.7703 15.3898 67.0249 15.4465 67.2511 15.5669C67.4773 15.6872 67.6666 15.8667 67.7989 16.0861C67.9311 16.3056 68.0014 16.5568 68.0022 16.813" fill="white"/>
        </svg>
      </div>

      <div className="text-white/90 text-center text-xs">
        <p>
          We sent a 6-digit code to{" "}
          <span className="text-orange-400 font-medium">{email}</span>.
        </p>
        <p className="mt-1">Please enter it below to reset your password.</p>
      </div>

      <div className="flex gap-2 justify-center" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            className={`w-12 h-14 text-center text-xl font-semibold rounded-lg bg-white/10 border-2 text-white transition-colors
              ${
                error
                  ? "border-red-400 focus:border-red-400"
                  : "border-orange-500/50 focus:border-orange-500"
              }
              focus:outline-none`}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-xs text-center">
          {error}
        </p>
      )}

      <p className="text-white/80 text-xs mt-5">
        Didn&apos;t receive it? You can resend in{" "}
        <span className="text-orange-400 font-medium">{formatTime(timer)}</span>
      </p>

      <div className="flex gap-3 w-full mt-2">
        <ActionButton
          label="Resend Code"
          variant="outline"
          fullWidth={false}
          onClick={handleResend}
          className="flex-1 !rounded-full !bg-transparent !border-orange-500/50 !text-orange-400 hover:!bg-orange-500/10"
        />
        <ActionButton
          label="Verify Code"
          variant="primary"
          fullWidth={false}
          onClick={handleVerify}
          className="flex-1 !rounded-full !bg-gradient-to-r !from-orange-500 !to-orange-600 hover:!from-orange-600 hover:!to-orange-700"
        />
      </div>
    </div>
  );
}