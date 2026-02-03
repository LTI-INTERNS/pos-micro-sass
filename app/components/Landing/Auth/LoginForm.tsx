"use client";

import { useState, useEffect } from "react";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

type LoginResponse =
  | { ok: true; role: "admin" | "cashier"; emailVerified: boolean; email: string }
  | { ok: false; message: string };

export default function LoginForm() {
  const router = useRouter();
  const [isLocked, setIsLocked] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);

  const [needsVerify, setNeedsVerify] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState("");

  useEffect(() => {
    const locked = localStorage.getItem("isLocked") === "true";
    setIsLocked(locked);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    setNeedsVerify(false);
    setResendMsg("");
  };

  const resendVerification = async () => {
    setResendLoading(true);
    setResendMsg("");

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error((data as any)?.message || "Failed to resend verification email");
      }

      setResendMsg("Verification email sent. Please check your inbox.");
    } catch (err: any) {
      setResendMsg(err.message || "Something went wrong");
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendMsg(""); 
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await res.json()) as LoginResponse;

      if (!data.ok || !res.ok) {
        throw new Error(!data.ok ? data.message : "Login failed");
      }

      if (!data.emailVerified) {
        setNeedsVerify(true);
        setPendingEmail(data.email);
        setError("Your email is not verified. Please verify to continue.");
        return; 
      }

      localStorage.removeItem("isLocked");
      setIsLocked(false);

      if (data.role === "admin") {
        router.push("/overview");
        console.log("Admin logged in");
        return;
      }

      if (data.role === "cashier") {
        router.push("/switchuser");
        console.log("User logged in");
        return;
      }

      router.push("/switchuser");
      console.log("Login successful");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border h-[650px] backdrop-blur border-gray-300 rounded-lg p-10 w-full max-w-xl flex flex-col"
    >
      <div className="flex items-center justify-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-white tracking-wide">Coca</h1>
        <img src="/logo.svg" alt="Coca Logo" className="w-8 h-8 object-contain" />
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-4">
        <h2 className="text-xl font-bold text-center text-white">Login form</h2>

        <p className="text-center text-white text-sm">
          Lorem Ipsum has been the industry's standard dummy text ever since.
        </p>

        {isLocked && (
          <p className="text-orange-300 text-center text-sm">
            Screen is locked. Please enter your credentials to continue.
          </p>
        )}

        {error && <p className="text-red-600 text-center">{error}</p>}

        {/*ADDED: verify email box */}
        {needsVerify && (
          <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-sm text-white">
            <p className="mb-2">
              Please verify your email to continue:{" "}
              <span className="font-semibold">{pendingEmail}</span>
            </p>

            <button
              type="button"
              onClick={resendVerification}
              disabled={resendLoading || !pendingEmail}
              className="text-orange-400 font-semibold hover:underline disabled:opacity-60"
            >
              {resendLoading ? "Sending..." : "Resend verification email"}
            </button>

            {resendMsg && (
              <p className="mt-2 text-xs text-white/80">
                {resendMsg}
              </p>
            )}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-400 mb-1">Username</label>

          <div className="relative flex items-center justify-center">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="username"
              type="text"
              placeholder="Enter username"
              value={form.username}
              onChange={handleChange}
              required
              className="w-full max-w-sm bg-white text-black rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Password</label>

          <div className="relative flex items-center justify-center">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              name="password"
              type="password"
              placeholder="Enter password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full max-w-sm bg-white text-black rounded-full py-2 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <a href="#" className="text-sm text-orange-600 hover:underline block mt-2 text-left">
            Forgot password?
          </a>
        </div>

        <button disabled={loading} className="w-full bg-orange-600 rounded-full text-white p-2">
          {loading ? "Running..." : "Running order"}
        </button>
      </div>
      <div className="text-center text-gray-400 text-sm mt-4">
        <button
          type="button"
          onClick={() => setShowAgreement(true)}
          className="hover:underline text-sm"
        >
          End user agreement.
        </button>
      </div>

      {showAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
            <h3 className="text-lg font-semibold mb-3">End User Agreement</h3>

            <p className="text-sm text-gray-600 mb-4">
              This system is for authorized employees only. By continuing, you agree to
              follow company policies, maintain data confidentiality, and use the system
              responsibly.
            </p>

            <button
              type="button"
              onClick={() => setShowAgreement(false)}
              className="w-full bg-orange-600 text-white rounded-md py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
