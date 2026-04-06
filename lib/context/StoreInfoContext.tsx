"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import type { BusinessTypeEnum, SubscriptionInfo } from "@/types/subscription.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StoreInfo = {
  storeName:    string;
  branchName:   string;
  cashierName:  string;
  telephone:    string;
  logoUrl:      string | null;
  businessType: BusinessTypeEnum | "";   // e.g. "CAFE" | "SUPERMARKET" | ""
  subscription: SubscriptionInfo | null; // null until the fetch resolves
};

type StoreInfoContextType = {
  storeInfo:    StoreInfo;
  setStoreInfo: (info: Partial<StoreInfo>) => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultStoreInfo: StoreInfo = {
  storeName:    "",
  branchName:   "",
  cashierName:  "",
  telephone:    "",
  logoUrl:      null,
  businessType: "",
  subscription: null,
};

// ── Backend response shape ────────────────────────────────────────────────────

interface StoreInfoResponse {
  success: boolean;
  data: {
    logoUrl:      string;
    telephone:    string;
    businessType: BusinessTypeEnum;
    subscription: SubscriptionInfo;
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const StoreInfoContext = createContext<StoreInfoContextType>({
  storeInfo:    defaultStoreInfo,
  setStoreInfo: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [storeInfo, setStoreInfoState] = useState<StoreInfo>(defaultStoreInfo);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;
    // Do not call the backend until a company has been selected —
    // /auth/store-info requires requireCompany and will 403 otherwise.
    if (!session.user.companyId) return;

    // ── Step 1: populate from session immediately (no network needed) ────────
    setStoreInfoState((prev) => ({
      ...prev,
      storeName:   session.user.companyName || prev.storeName,
      branchName:  session.user.branchName  || prev.branchName,
      cashierName: session.user.name        || prev.cashierName,
    }));

    // ── Step 2: fetch logoUrl, telephone, businessType and subscription ──────
    apiClient
      .get<StoreInfoResponse>("/auth/store-info")
      .then(({ data: res }) => {
        if (!res.success) return;
        setStoreInfoState((prev) => ({
          ...prev,
          logoUrl:      res.data.logoUrl      || prev.logoUrl,
          telephone:    res.data.telephone    || prev.telephone,
          businessType: res.data.businessType || prev.businessType,
          subscription: res.data.subscription ?? prev.subscription,
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

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStoreInfo() {
  return useContext(StoreInfoContext);
}