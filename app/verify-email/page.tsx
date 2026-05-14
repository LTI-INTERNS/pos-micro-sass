"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const run = async () => {
      if (!token) {
        setStatus("error");
        setMessage("Missing token");
        return;
      }

      try {
        const res = await fetch("/api/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Verification failed");

        setStatus("success");
        setMessage(`Email verified: ${data.email}`);

        setTimeout(() => router.push("/login"), 1500);
      } catch (e) {
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "Verification failed");
      }
    };

    run();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="bg-white w-full max-w-md rounded-xl border p-6 text-center">
        <h1 className="text-lg font-semibold">Email Verification</h1>

        {status === "loading" && <p className="mt-3 text-sm text-gray-600">Verifying...</p>}

        {status === "success" && (
          <p className="mt-3 text-sm text-green-600">{message} ✅</p>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{message}</p>
        )}

        <p className="mt-4 text-xs text-gray-400">
          You will be redirected to login automatically.
        </p>
      </div>
    </div>
  );
}