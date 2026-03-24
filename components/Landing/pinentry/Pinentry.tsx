"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { useImage } from "@/lib/context/ImageContext";
import ManagerVerification from "./ManagerVerification";

type StoredCashier = {
  cashierId: string;
  name:      string;
  img:       string;
};

type FormStep = "pin-entry" | "manager-verification" | "new-pin-entry";

const CASHIER_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes idle → back to switch-user

export default function PinEntryPage() {
  const router = useRouter();
  const { backgroundImage } = useImage();

  const [pin, setPin]           = useState("");
  const [newPin, setNewPin]     = useState("");
  const [cashier, setCashier]   = useState<StoredCashier | null>(null);
  const [formStep, setFormStep] = useState<FormStep>("pin-entry");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ── Idle timeout ────────────────────────────────────────────────────────────
  const resetCashierTimeout = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      sessionStorage.removeItem("cashier");
      router.replace("/switchuser");
    }, CASHIER_TIMEOUT_MS);
  }, [router]);

  // ── Load cashier from sessionStorage ────────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem("cashier");
    if (!stored) {
      router.replace("/switchuser");
      return;
    }
    setCashier(JSON.parse(stored) as StoredCashier);
    resetCashierTimeout();
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [router, resetCashierTimeout]);

  // ── Reset idle timer on any user interaction ─────────────────────────────────
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "touchstart"];
    const handler = () => resetCashierTimeout();
    events.forEach((e) => window.addEventListener(e, handler));
    return () => events.forEach((e) => window.removeEventListener(e, handler));
  }, [resetCashierTimeout]);

  // ── Keypad helpers ───────────────────────────────────────────────────────────
  const activePin    = formStep === "new-pin-entry" ? newPin : pin;
  const setActivePin = formStep === "new-pin-entry" ? setNewPin : setPin;

  const handleNumber = (num: number) => {
    resetCashierTimeout();
    if (activePin.length >= 4) return;
    setActivePin((prev) => prev + num.toString());
    setError("");
  };

  const clearPin = () => {
    resetCashierTimeout();
    setActivePin("");
    setError("");
  };

  const backspace = () => {
    resetCashierTimeout();
    setActivePin((prev) => prev.slice(0, -1));
    setError("");
  };

  const goBack = () => {
    if (formStep !== "pin-entry") {
      setFormStep("pin-entry");
      setPin("");
      setNewPin("");
      setError("");
    } else {
      sessionStorage.removeItem("cashier");
      router.push("/switchuser");
    }
  };

  // ── PIN submission — verify against backend, then create session ─────────────
  const handleUnlock = async () => {
    if (!cashier || pin.length !== 4) return;
    resetCashierTimeout();
    setLoading(true);
    setError("");

    try {
      // Step 1: verify PIN server-side via our Next.js proxy
      const verifyRes = await fetch("/api/auth/verify-pin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ cashierId: cashier.cashierId, pin }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyRes.ok || !verifyData.success) {
        setError(verifyData.error ?? "Incorrect PIN. Please try again.");
        setPin("");
        setLoading(false);
        return;
      }

      const d = verifyData.data;

      // Step 2: create the NextAuth session using cashier-pin provider
      const signInResult = await signIn("cashier-pin", {
        cashierId:   d.cashierId,
        name:        d.name,
        role:        d.role,        // 'CASHIER'
        branchId:    d.branchId,
        branchName:  d.branchName,
        companyId:   d.companyId,
        companyName: d.companyName,
        token:       d.token,
        redirect:    false,
      });

      if (!signInResult?.ok) {
        setError("Session could not be created. Please try again.");
        setPin("");
        setLoading(false);
        return;
      }

      // Step 3: route by role
      sessionStorage.removeItem("cashier");
      const role = d.role?.toUpperCase();

      if (role === "CASHIER") {
        router.push("/posdashboard");
      } else {
        // MANAGER, OWNER, ADMIN → admin dashboard
        router.push("/overview");
      }

    } catch {
      setError("Network error. Please try again.");
      setPin("");
      setLoading(false);
    }
  };

  // ── Update PIN flow ──────────────────────────────────────────────────────────
  const handleResetPinClick = () => {
    setFormStep("manager-verification");
    setError("");
    setPin("");
  };

  const handleManagerVerified = () => {
    resetCashierTimeout();
    setFormStep("new-pin-entry");
  };

  const handleUpdatePin = async () => {
    resetCashierTimeout();
    if (newPin.length !== 4) {
      setError("Please enter a 4-digit PIN.");
      return;
    }
    if (!cashier) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cashiers/update-pin", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ cashierId: cashier.cashierId, newPin }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error ?? "Failed to update PIN. Please try again.");
        return;
      }

      setFormStep("pin-entry");
      setNewPin("");
      setError("");
      // Show brief success state
      setError(""); // cleared; user sees the normal PIN entry screen again
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const pinDots = "●".repeat(activePin.length);

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
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-gray/10 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white z-10"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="p-5 w-[320px] text-center rounded-2xl bg-black/10 backdrop-blur-md border border-white/20 z-10">

        {/* ── Cashier avatar ───────────────────────────────────────────────── */}
        {cashier && formStep === "pin-entry" && (
          <div className="flex flex-col items-center mb-4">
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

        {/* ── PIN Entry ────────────────────────────────────────────────────── */}
        {formStep === "pin-entry" && (
          <>
            <div className="w-full mb-5 text-center">
              <div className="w-full py-3 text-white text-2xl tracking-[0.35em] bg-transparent border-b border-white/30 select-none">
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
              <div className="mb-4 text-left">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
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
                  disabled={loading}
                  className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={clearPin}
                disabled={loading}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
              >
                C
              </button>
              <button
                onClick={() => handleNumber(0)}
                disabled={loading}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
              >
                0
              </button>
              <button
                aria-label="Backspace"
                onClick={backspace}
                disabled={loading}
                className="py-3 cursor-pointer rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 disabled:opacity-50"
              >
                <div className="relative w-6 h-6 mx-auto">
                  <Image src="/backspace.png" alt="" fill className="object-contain" />
                </div>
              </button>
            </div>

            <button
              onClick={handleUnlock}
              disabled={pin.length !== 4 || loading}
              className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Unlock"}
            </button>
          </>
        )}

        {/* ── Manager Verification ─────────────────────────────────────────── */}
        {formStep === "manager-verification" && (
          <ManagerVerification
            onVerified={handleManagerVerified}
            onCancel={goBack}
          />
        )}

        {/* ── Set New PIN ──────────────────────────────────────────────────── */}
        {formStep === "new-pin-entry" && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-1">Set New PIN</h3>
              <p className="text-sm text-white/70">Enter your new 4-digit PIN</p>
            </div>

            <div className="w-full mb-10 text-center">
              <div className="w-full py-3 text-white text-2xl tracking-[0.35em] bg-transparent border-b border-white/30 select-none">
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
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-white/90">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-x-2 gap-y-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                <button
                  key={num}
                  onClick={() => handleNumber(num)}
                  disabled={loading}
                  className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
                >
                  {num}
                </button>
              ))}
              <button
                onClick={clearPin}
                disabled={loading}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
              >
                C
              </button>
              <button
                onClick={() => handleNumber(0)}
                disabled={loading}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 text-white disabled:opacity-50"
              >
                0
              </button>
              <button
                aria-label="Backspace"
                onClick={backspace}
                disabled={loading}
                className="py-3 rounded-3xl bg-gray/8 backdrop-blur-md hover:bg-white/20 border border-white/30 disabled:opacity-50"
              >
                <div className="relative w-6 h-6 mx-auto">
                  <Image src="/backspace.png" alt="" fill className="object-contain" />
                </div>
              </button>
            </div>

            <button
              onClick={handleUpdatePin}
              disabled={newPin.length !== 4 || loading}
              className="w-full py-2 rounded-full bg-orange-500 hover:bg-orange-600 font-semibold hover:text-white cursor-pointer transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Updating..." : "Update PIN"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}