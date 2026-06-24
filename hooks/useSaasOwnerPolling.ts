"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";

const POLL_INTERVAL = 15_000;

interface VersionResponse {
  success: boolean;
  data: { version: string };
}

export function useSaasOwnerPolling() {
  const queryClient   = useQueryClient();
  const lastVersionRef = useRef<string | null>(null);
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function checkVersion() {
      try {
        const res = await apiClient.get<VersionResponse>("/saas-owner/version");
        const incoming = res.data?.data?.version;

        if (!incoming) return;

        if (lastVersionRef.current === null) {
          lastVersionRef.current = incoming;
          return;
        }

        if (lastVersionRef.current === incoming) return;

        lastVersionRef.current = incoming;

        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: queryKeys.saasOwner.companies(),
          }),
          queryClient.invalidateQueries({
            queryKey: queryKeys.saasOwner.subscriptionSummary(),
          }),
        ]);
      } catch {

      }
    }

    void checkVersion();
    timerRef.current = setInterval(() => void checkVersion(), POLL_INTERVAL);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [queryClient]);
}
