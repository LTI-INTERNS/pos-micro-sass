"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import UserAvatar from "@/components/Landing/switchuser/UserAvatar";

type Cashier = {
  cashierId: string;
  cashierNo: string;
  name: string;
  imgUrl: string | null;
  activeStatus: boolean;
};

export default function UserRow() {
  const router = useRouter();

  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCashiers = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/branch-session/cashiers", {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.error ?? "Failed to load cashiers");
        }

        setCashiers(result.data as Cashier[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cashiers");
      } finally {
        setLoading(false);
      }
    };

    fetchCashiers();
  }, []);

  const handleSelectUser = (cashier: Cashier) => {
    sessionStorage.setItem(
      "cashier",
      JSON.stringify({
        cashierId: cashier.cashierId,
        name: cashier.name,
        img: cashier.imgUrl?.trim() || "",
      })
    );

    router.push("/pinentry");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center gap-8 px-6 py-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
            <div className="w-20 h-20 rounded-full bg-white/20" />
            <div className="w-16 h-3 rounded-full bg-white/20" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-white/70 py-6 text-sm">
        <p>{error}</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-3 text-orange-400 hover:underline text-sm"
        >
          Return to login
        </button>
      </div>
    );
  }

  if (cashiers.length === 0) {
    return (
      <div className="text-center text-white/70 py-6 text-sm">
        No active cashiers found for this branch.
      </div>
    );
  }

  return (
  <div className="relative mx-auto w-full max-w-6xl bg-transparent px-6">
    <div
      className="
        flex flex-wrap justify-center items-start
        gap-x-12 gap-y-8
        py-4
        bg-transparent
      "
    >
      {cashiers.map((cashier) => (
        <div
          key={cashier.cashierId}
          onClick={() => handleSelectUser(cashier)}
          className="w-27.5 flex justify-center bg-transparent cursor-pointer"
        >
          <UserAvatar
            name={cashier.name}
            img={cashier.imgUrl?.trim() || ""}
          />
        </div>
      ))}
    </div>
  </div>
);
}