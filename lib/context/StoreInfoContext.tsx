"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";
import type { BusinessTypeEnum, ScheduledSubscriptionInfo, SubscriptionBillingStatus, SubscriptionInfo } from "@/types/subscription.types";

// ── Types ─────────────────────────────────────────────────────────────────────

export type StoreInfo = {
  storeName: string;
  branchName: string;
  cashierName: string;
  telephone: string;
  logoUrl: string | null;
  businessType: BusinessTypeEnum | "";     // e.g. "CAFE" | "SUPERMARKET" | ""
  businessTypeId: string;                    // Business type ID from database
  subscription: SubscriptionInfo | null;   // null until the fetch resolves
  hasStripeCustomer: boolean;
  hasStripeSubscription: boolean;
  subscriptionBillingStatus: SubscriptionBillingStatus;
  currentPeriodEnd: string | null;
  scheduledSubscription: ScheduledSubscriptionInfo | null;
};

type StoreInfoContextType = {
  storeInfo: StoreInfo;
  setStoreInfo: (info: Partial<StoreInfo>) => void;
  refreshStoreInfo: () => Promise<void>;
  isStoreInfoLoading: boolean;
};

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultStoreInfo: StoreInfo = {
  storeName: "",
  branchName: "",
  cashierName: "",
  telephone: "",
  logoUrl: null,
  businessType: "",
  businessTypeId: "",
  subscription: null,
  hasStripeCustomer: false,
  hasStripeSubscription: false,
  subscriptionBillingStatus: null,
  currentPeriodEnd: null,
  scheduledSubscription: null,
};

// ── Backend response shape ────────────────────────────────────────────────────

interface StoreInfoResponse {
  success: boolean;
  data: {
    logoUrl: string;
    telephone: string;
    businessType: BusinessTypeEnum;
    businessTypeId: string;
    subscription: SubscriptionInfo;
    hasStripeCustomer: boolean;
    hasStripeSubscription: boolean;
    subscriptionBillingStatus: SubscriptionBillingStatus;
    currentPeriodEnd: string | null;
    scheduledSubscription: ScheduledSubscriptionInfo | null;
  };
}

// ── Context ───────────────────────────────────────────────────────────────────

const StoreInfoContext = createContext<StoreInfoContextType>({
  storeInfo: defaultStoreInfo,
  setStoreInfo: () => { },
  refreshStoreInfo: async () => { },
  isStoreInfoLoading: false,
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function StoreInfoProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [storeInfo, setStoreInfoState] = useState<StoreInfo>(defaultStoreInfo);
  const [isStoreInfoLoading, setIsStoreInfoLoading] = useState(false);

  const companyId = session?.user?.companyId ?? "";
  const companyName = session?.user?.companyName ?? "";
  const branchName = session?.user?.branchName ?? "";
  const userName = session?.user?.name ?? "";

  // Guard: only call the backend API once per authenticated companyId,
  // but allow manual refreshes after plan changes or database updates.
  const fetchedForId = useRef("");

  const applySessionInfo = useCallback(() => {
    setStoreInfoState((prev) => ({
      ...prev,
      storeName: companyName || prev.storeName,
      branchName: branchName || prev.branchName,
      cashierName: userName || prev.cashierName,
    }));
  }, [companyName, branchName, userName]);

  const refreshStoreInfo = useCallback(async () => {
    if (status !== "authenticated" || !companyId) return;

    applySessionInfo();
    setIsStoreInfoLoading(true);

    try {
      const { data: res } = await apiClient.get<StoreInfoResponse>("/auth/store-info");
      if (!res.success) return;

      setStoreInfoState((prev) => ({
        ...prev,
        logoUrl: res.data.logoUrl || prev.logoUrl,
        telephone: res.data.telephone || prev.telephone,
        businessType: res.data.businessType || prev.businessType,
        businessTypeId: res.data.businessTypeId || prev.businessTypeId,
        subscription: res.data.subscription ?? prev.subscription,
        hasStripeCustomer: Boolean(res.data.hasStripeCustomer),
        hasStripeSubscription: Boolean(res.data.hasStripeSubscription),
        subscriptionBillingStatus: res.data.subscriptionBillingStatus ?? null,
        currentPeriodEnd: res.data.currentPeriodEnd ?? null,
        scheduledSubscription: res.data.scheduledSubscription ?? null,
      }));

      fetchedForId.current = companyId;
    } catch {
      // Non-fatal — keep session-derived values, but allow the next render/manual
      // refresh to retry instead of permanently showing stale/null subscription data.
      fetchedForId.current = "";
    } finally {
      setIsStoreInfoLoading(false);
    }
  }, [status, companyId, applySessionInfo]);

  useEffect(() => {
    if (status !== "authenticated" || !companyId) return;

    applySessionInfo();

    if (fetchedForId.current === companyId) return;
    void refreshStoreInfo();

    // Use stable primitives — NOT the session object (new ref every render = infinite loop)
  }, [status, companyId, applySessionInfo, refreshStoreInfo]);

  const setStoreInfo = (info: Partial<StoreInfo>) => {
    setStoreInfoState((prev) => ({ ...prev, ...info }));
  };

  return (
    <StoreInfoContext.Provider value={{ storeInfo, setStoreInfo, refreshStoreInfo, isStoreInfoLoading }}>
      {children}
    </StoreInfoContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useStoreInfo() {
  return useContext(StoreInfoContext);
}