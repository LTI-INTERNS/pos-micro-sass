"use client";

import { useEffect, useRef, useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle } from "lucide-react";

type Props = {
  variant?: "pos" | "switchuser";
  checkIntervalMs?: number;
};

export default function SessionExpiryGuard({
  variant = "pos",
  checkIntervalMs = 30000,
}: Props) {
  const [expired, setExpired] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkBranchSession = async () => {
      try {
        const res = await fetch("/api/branch-session", {
          method: "GET",
          cache: "no-store",
        });

        if (!res.ok) {
          setExpired(true);

          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        }
      } catch {
        setExpired(true);

        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      }
    };

    checkBranchSession();
    intervalRef.current = setInterval(checkBranchSession, checkIntervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [checkIntervalMs]);

  const handleReLogin = async () => {
    try {
      setLoggingOut(true);

      localStorage.removeItem("isLocked");
      sessionStorage.removeItem("cashier");

      await fetch("/api/branch-session", { method: "DELETE" });

      await signOut({ callbackUrl: "/login?expired=true" });
    } catch (error) {
      console.error("SESSION EXPIRY LOGOUT ERROR:", error);
      window.location.href = "/login?expired=true";
    }
  };

  if (!expired) return null;

  const isSwitchUser = variant === "switchuser";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/55 backdrop-blur-sm px-4">
      <div
        className={
          isSwitchUser
            ? "w-full max-w-md rounded-[28px] border border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-xl"
            : "w-full max-w-md rounded-[28px] bg-white shadow-2xl"
        }
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center justify-center mb-4">
            <div
              className={
                isSwitchUser
                  ? "flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-orange-300 ring-1 ring-white/20"
                  : "flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500"
              }
            >
              <AlertTriangle size={28} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2
              className={
                isSwitchUser
                  ? "text-xl font-bold text-white"
                  : "text-xl font-bold text-gray-900"
              }
            >
              Session Expired
            </h2>

            <p
              className={
                isSwitchUser
                  ? "text-sm leading-6 text-white/75"
                  : "text-sm leading-6 text-gray-500"
              }
            >
              Your session has expired. Please log in again to continue.
            </p>
          </div>

          <div className="mt-6">
            <button
              onClick={handleReLogin}
              disabled={loggingOut}
              className={
                isSwitchUser
                  ? "w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all"
                  : "w-full rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 transition-all"
              }
            >
              {loggingOut ? "Redirecting..." : "Log In Again"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}