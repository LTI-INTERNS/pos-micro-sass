"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import type { BusinessTypeEnum, SubscriptionInfo } from "@/types/subscription.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StoreInfo = {
  storeName:     string;
  branchName:    string;
  cashierName:   string;
  telephone:     string;
  logoUrl:       string | null;
  businessType:  BusinessTypeEnum | "";     // e.g. "CAFE" | "SUPERMARKET" | ""
  businessTypeId: string;                    // Business type ID from database
  subscription:  SubscriptionInfo | null;   // null until the fetch resolves
};

type StoreInfoContextType = {
  storeInfo:    StoreInfo;
  setStoreInfo: (info: Partial<StoreInfo>) => void;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultStoreInfo: StoreInfo = {
  storeName:     "",
  branchName:    "",
  cashierName:   "",
  telephone:     "",
  logoUrl:       null,
  businessType:  "",
  businessTypeId: "",
  subscription:  null,
};

// ── Backend response shape ────────────────────────────────────────────────────

interface StoreInfoResponse {
  success: boolean;
  data: {
    logoUrl:       string;
    telephone:     string;
    businessType:  BusinessTypeEnum;
    businessTypeId: string;
    subscription:  SubscriptionInfo;
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

  const companyId  = session?.user?.companyId  ?? "";
  const companyName = session?.user?.companyName ?? "";
  const branchName  = session?.user?.branchName  ?? "";
  const userName    = session?.user?.name        ?? "";

  // Guard: only call the backend API once per authenticated companyId
  const fetchedForId = useRef("");

  useEffect(() => {
    if (status !== "authenticated" || !companyId) return;

    // ── Step 1: populate from session immediately (no network needed) ────────
    setStoreInfoState((prev) => ({
      ...prev,
      storeName:   companyName || prev.storeName,
      branchName:  branchName  || prev.branchName,
      cashierName: userName    || prev.cashierName,
    }));

    // ── Step 2: fetch logoUrl, telephone, businessType and subscription ──────
    // Only hit the network if we haven't already fetched for this companyId
    if (fetchedForId.current === companyId) return;
    fetchedForId.current = companyId;

    apiClient
      .get<StoreInfoResponse>("/auth/store-info")
      .then(({ data: res }) => {
        if (!res.success) return;
        setStoreInfoState((prev) => ({
          ...prev,
          logoUrl:        res.data.logoUrl        || prev.logoUrl,
          telephone:      res.data.telephone      || prev.telephone,
          businessType:   res.data.businessType   || prev.businessType,
          businessTypeId: res.data.businessTypeId || prev.businessTypeId,
          subscription:   res.data.subscription   ?? prev.subscription,
        }));
      })
      .catch(() => {
        // Non-fatal — store name and branch are already populated from session
      });

  // Use stable primitives — NOT the session object (new ref every render = infinite loop)
  }, [status, companyId, companyName, branchName, userName]);

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