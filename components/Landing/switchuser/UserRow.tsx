"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserAvatar from "@/components/Landing/switchuser/UserAvatar";

type Cashier = {
  cashierId:    string;
  cashierNo:    string;
  name:         string;
  imgUrl:       string | null;
  activeStatus: boolean;
};

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const FALLBACK_IMG = "https://i.pravatar.cc/150?img=";

export default function UserRow() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [cashiers, setCashiers] = useState<Cashier[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    if (status === "loading") return;

    // Guard: must have a branch session to fetch cashiers
    if (!session?.user?.branchId || !session?.user?.backendToken) {
      router.replace("/login");
      return;
    }

    const fetchCashiers = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(
          `${API}/api/v1/branches/${session.user.branchId}/cashiers`,
          {
            headers: {
              Authorization: `Bearer ${session.user.backendToken}`,
            },
          }
        );

        const result = await res.json();

        if (!res.ok || !result.success) {
          throw new Error(result.message ?? "Failed to load cashiers");
        }

        setCashiers(result.data as Cashier[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load cashiers");
      } finally {
        setLoading(false);
      }
    };

    fetchCashiers();
  }, [session, status, router]);

  const handleSelectUser = (cashier: Cashier) => {
    // Store selected cashier in sessionStorage for /pinentry
    sessionStorage.setItem(
      "cashier",
      JSON.stringify({
        cashierId: cashier.cashierId,
        name:      cashier.name,
        img:       cashier.imgUrl ?? `${FALLBACK_IMG}${Math.floor(Math.random() * 70) + 1}`,
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
    <div className="relative mx-auto max-w-5xl bg-transparent">
      <div
        onWheel={(e) => {
          const el = e.currentTarget;
          if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }}
        className="
          flex gap-12 px-6 py-3
          overflow-x-auto
          snap-x snap-mandatory
          scroll-smooth
          scrollbar-hide
          bg-transparent
          cursor-pointer
          items-center justify-center
        "
      >
        {cashiers.map((cashier) => (
          <div
            key={cashier.cashierId}
            onClick={() => handleSelectUser(cashier)}
            className="shrink-0 snap-center bg-transparent"
            style={{ width: "calc((100% - 192px) / 5)" }}
          >
            <UserAvatar
              name={cashier.name}
              img={cashier.imgUrl ?? `${FALLBACK_IMG}${cashier.cashierNo}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
