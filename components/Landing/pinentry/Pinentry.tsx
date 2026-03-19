"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useImage } from "@/lib/context/ImageContext";
import ManagerVerification from "./ManagerVerification";

type Cashier = {
  name: string;
  img: string;
};

type FormStep = "pin-entry" | "manager-verification" | "new-pin-entry";

// Mock correct PIN for demo - replace with actual verification logic
const CORRECT_PIN = "1234";

export default function PinEntryPage() {
  const router = useRouter();

  const { backgroundImage } = useImage();

  const [pin, setPin] = useState<string>("");
  const [newPin, setNewPin] = useState<string>("");
  const [cashier, setCashier] = useState<Cashier | null>(null);
  const [formStep, setFormStep] = useState<FormStep>("pin-entry");
  const [error, setError] = useState<string>("");

  const CASHIER_TIMEOUT_MS = 2 * 60 * 1000;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetCashierTimeout = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      sessionStorage.removeItem("cashier");
      router.replace("/switchuser");
    }, CASHIER_TIMEOUT_MS);
  }, [router, CASHIER_TIMEOUT_MS]);

  useEffect(() => {
    const stored = sessionStorage.getItem("cashier");

    if (!stored) {
      router.replace("/switchuser");
      return;
    }

    setCashier(JSON.parse(stored));
    resetCashierTimeout();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [router, resetCashierTimeout]);

  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handler = () => resetCashierTimeout();

    events.forEach((event) => window.addEventListener(event, handler));
    return () => events.forEach((event) => window.removeEventListener(event, handler));
  }, [resetCashierTimeout]);

  const handleNumber = (num: number) => {
    resetCashierTimeout();
    const currentPin = formStep === "new-pin-entry" ? newPin : pin;
    
    if (currentPin.length >= 4) return;
    
    if (formStep === "new-pin-entry") {
      setNewPin((prev) => prev + num.toString());
    } else {
      setPin((prev) => prev + num.toString());
    }
    setError("");
  };

  const clearPin = () => {
    resetCashierTimeout();
    if (formStep === "new-pin-entry") {
      setNewPin("");
    } else {
      setPin("");
    }
    setError("");
  };

  const backspace = () => {
    resetCashierTimeout();
    if (formStep === "new-pin-entry") {
      setNewPin((prev) => prev.slice(0, -1));
    } else {
      setPin((prev) => prev.slice(0, -1));
    }
    setError("");
  };

  const goBack = () => {
    if (formStep === "manager-verification" || formStep === "new-pin-entry") {
      setFormStep("pin-entry");
      setPin("");
      setNewPin("");
      setError("");
    } else {
      sessionStorage.removeItem("cashier");
      router.push("/switchuser");
    }
  };

  const handleUnlock = () => {
    resetCashierTimeout();

    // Verify PIN
    if (pin !== CORRECT_PIN) {
      setError("PIN is incorrect. Please try again.");
      return;
    }

    // PIN is correct - proceed to unlock
    // Add your unlock logic here
    router.push("/posdashboard");
  };

  const handleResetPinClick = () => {
    setFormStep("manager-verification");
    setError("");
    setPin("");
  };

  const handleManagerVerified = () => {
    resetCashierTimeout();
    setFormStep("new-pin-entry");
  };

  const handleUpdatePin = () => {
    resetCashierTimeout();

    if (newPin.length !== 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }

    // Update PIN logic here
    // In a real application, you would update the PIN in your backend
    console.log("PIN updated successfully:", newPin);

    // Reset to initial state
    setFormStep("pin-entry");
    setNewPin("");
    setError("");
    alert("PIN updated successfully!");
  };

  const currentPinValue = formStep === "new-pin-entry" ? newPin : pin;
  const pinDots = "●".repeat(currentPinValue.length);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative">
      <Image
        src={backgroundImage}
        alt="Background"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/20" />

      <button
        onClick={goBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="p-5 w-[320px] text-center rounded-2xl bg-black/10 backdrop-blur-md border border-white/20">

        {cashier && formStep === "pin-entry" && (
          <div className="flex flex-col items-center">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/30">
              <Image
                src={cashier.img}
                alt={cashier.name}
                fill
                className="object-cover"
              />
            </div>
            <p className="mt-3 text-sm text-white/70">Cashier</p>
            <h2 className="text-lg font-semibold text-white">{cashier.name}</h2>
          </div>
        )}

        {/* PIN Entry Form */}
        {formStep === "pin-entry" && (
          <>
            <div className="w-full mb-5 text-center">
              <div
                className="
                  w-full py-3
                  text-white text-2xl tracking-[0.35em]
                  bg-transparent
                  border-b border-white/30
                  select-none
                "
              >
                {pin.length === 0 ? (
                  <span className="text-white/60 text-base tracking-normal">
                    Enter your PIN
                  </span>
                ) : (
                  pinDots
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-white/90">{error}</p>
                    <button
                      onClick={handleResetPinClick}
                      className="text-sm text-white/90 underline hover:text-white mt-1 cursor-pointer"
                    >
                      Reset your PIN
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumber(num)}
                  className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
                >
                  {num}
                </button>
              ))}

              <button
                onClick={clearPin}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
              >
                C
              </button>

              <button
                onClick={() => handleNumber(0)}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
              >
                0
              </button>

              <button
                onClick={backspace}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30"
              >
                <div className="relative w-6 h-6 mx-auto">
                  <Image src="/backspace.png" alt="Backspace" fill className="object-contain" />
                </div>
              </button>
            </div>

            <button
              onClick={handleUnlock}
              disabled={pin.length !== 4}
              className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Unlock
            </button>
          </>
        )}

        {/* Manager Verification Form */}
        {formStep === "manager-verification" && (
          <ManagerVerification
            onVerified={handleManagerVerified}
            onCancel={goBack}
          />
        )}

        {/* New PIN Entry Form */}
        {formStep === "new-pin-entry" && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Set New PIN</h3>
              <p className="text-sm text-white/70">Enter your new 4-digit PIN</p>
            </div>

            <div className="w-full mb-10 text-center">
              <div
                className="
                  w-full py-3
                  text-white text-2xl tracking-[0.35em]
                  bg-transparent
                  border-b border-white/30
                  select-none
                "
              >
                {newPin.length === 0 ? (
                  <span className="text-white/60 text-base tracking-normal">
                    Enter new PIN
                  </span>
                ) : (
                  pinDots
                )}
              </div>
            </div>

            {error && (
              <div className="mb-6 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumber(num)}
                  className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
                >
                  {num}
                </button>
              ))}

              <button
                onClick={clearPin}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
              >
                C
              </button>

              <button
                onClick={() => handleNumber(0)}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white"
              >
                0
              </button>

              <button
                onClick={backspace}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30"
              >
                <div className="relative w-6 h-6 mx-auto">
                  <Image src="/backspace.png" alt="Backspace" fill className="object-contain" />
                </div>
              </button>
            </div>

            <button
              onClick={handleUpdatePin}
              disabled={newPin.length !== 4}
              className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update PIN
            </button>
          </>
        )}
      </div>
    </div>
  );
}