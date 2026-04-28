export const queryKeys = {
  customers: {
    list: (branchId?: string) => ["customers", "list", { branchId: branchId ?? null }] as const,
    stats: (branchId?: string) => ["customers", "stats", { branchId: branchId ?? null }] as const,
  },
  cashiers: {
    list: (branchId?: string) => ["cashiers", "list", { branchId: branchId ?? null }] as const,
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
} as const;
