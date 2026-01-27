"use client";

import { useState } from "react";
import { User, Lock } from "lucide-react";
import { useRouter } from "next/navigation";


export default function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAgreement, setShowAgreement] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Login failed");
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
        <h2 className="text-xl font-bold text-center text-white">
          Login form
        </h2>

        <p className="text-center text-white text-sm">
          Lorem Ipsum has been the industry's standard dummy text ever since.
        </p>

        {error && <p className="text-red-600 text-center">{error}</p>}

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
    className="hover:underline text-sm">
          End user agreement.
        </button>
</div>{showAgreement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
      <h3 className="text-lg font-semibold mb-3">
        End User Agreement
      </h3>

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
