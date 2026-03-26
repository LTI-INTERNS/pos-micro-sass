"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export type StoreInfo = {
  storeName:   string;
  branchName:  string;
  cashierName: string;
  telephone:   string;
  logoUrl:     string | null;
};

const defaultStoreInfo: StoreInfo = {
  storeName:   "",
  branchName:  "",
  cashierName: "",
  telephone:   "",
  logoUrl:     null,
};

type StoreInfoContextType = {
  storeInfo:    StoreInfo;
  setStoreInfo: (info: Partial<StoreInfo>) => void;
};

const StoreInfoContext = createContext<StoreInfoContextType>({
  storeInfo:    defaultStoreInfo,
  setStoreInfo: () => {},
});

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [storeInfo, setStoreInfoState] = useState<StoreInfo>(defaultStoreInfo);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    // ── Step 1: populate from session immediately (no network needed) ───────
    setStoreInfoState((prev) => ({
      ...prev,
      storeName:   session.user.companyName || prev.storeName,
      branchName:  session.user.branchName  || prev.branchName,
      cashierName: session.user.name        || prev.cashierName,
    }));

    // ── Step 2: fetch logoUrl and telephone from backend ────────────────────
    apiClient
      .get<{ success: boolean; data: { logoUrl: string; telephone: string } }>(
        "/auth/store-info",
      )
      .then(({ data: res }) => {
        if (!res.success) return;
        setStoreInfoState((prev) => ({
          ...prev,
          logoUrl:   res.data.logoUrl   || prev.logoUrl,
          telephone: res.data.telephone || prev.telephone,
        }));
      })
      .catch(() => {
        // Non-fatal — store name and branch are already populated from session
      });

  // Re-run when the session changes (e.g. after company selection)
  }, [status, session]);

  const setStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfoState((prev) => ({ ...prev, ...info }));
  };

  return (
    <StoreInfoContext.Provider value={{ storeInfo, setStoreInfo }}>
      {children}
    </StoreInfoContext.Provider>
  );
}

export function useStoreInfo() {
  return useContext(StoreInfoContext);
}