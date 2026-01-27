"use client";

import Clock from "../components/Landing/clock";
import RoleButton from "../components/Admin/common/ActionButton";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center text-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/landing.png')",
      }}
    >
      
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        <Clock />

        <div className="flex gap-4">
          <RoleButton className="px-8 py-3 rounded-full border border-white/30 text-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition text-sm md:text-base" label="Cashier" onClick={() => router.push("/switchuser")} />
          <RoleButton className="px-8 py-3 rounded-full border border-white/30 text-white backdrop-blur-md bg-white/10 hover:bg-white/20 transition text-sm md:text-base" label="Admin" />
        </div>
      </div>
    </main>
  );
}
