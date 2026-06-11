import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

export const queryKeys = {
  customers: {
    list: (branchId?: string) => ["customers", "list", { branchId: branchId ?? null }] as const,
    stats: (branchId?: string) => ["customers", "stats", { branchId: branchId ?? null }] as const,
  },
  cashiers: {
    list:  (branchId?: string) => ["cashiers", "list",  { branchId: branchId ?? null }] as const,
    stats: (branchId?: string) => ["cashiers", "stats", { branchId: branchId ?? null }] as const,
  },
  orders: {
    list: (params: {
      branchId?: string;
      startDate?: string;
      endDate?: string;
      canSeeAllBranches: boolean;
    }) => [
      "orders",
      "list",
      {
        branchId: params.branchId ?? null,
        startDate: params.startDate ?? null,
        endDate: params.endDate ?? null,
        canSeeAllBranches: params.canSeeAllBranches,
      },
    ] as const,
    stats: (branchId?: string) => ["orders", "stats", { branchId: branchId ?? null }] as const,
  },

  // ── SaaS Owner ──────────────────────────────────────────────────────────────
  saasOwner: {
    version:             () => ["saasOwner", "version"]           as const,
    companies:           () => ["saasOwner", "companies"]           as const,
    company:             (id: string) => ["saasOwner", "company", id] as const,
    subscriptionSummary: () => ["saasOwner", "subscriptionSummary"] as const,
    allSubscriptions:    () => ["saasOwner", "allSubscriptions"] as const,
    subscriptionDetail:  (type: string) => ["saasOwner", "subscription", type] as const,
  },
} as const;
