// ── Enums (mirror the Prisma schema exactly) ──────────────────────────────────

export type BusinessTypeEnum =
  | 'CAFE'
  | 'CLOTHING'
  | 'SUPERMARKET'
  | 'PHARMACY'
  | 'HARDWARE'
  | 'BOOKSHOP';

export type SubscriptionType = 'FREE' | 'PRO' | 'ENTERPRISE';

export type SupportLevel = 'BASIC' | 'PRIORITY' | 'SUPPORT_24_7';

// ── Subscription shape returned by /auth/store-info ──────────────────────────

export interface SubscriptionInfo {
  type:              SubscriptionType;
  branchLimit:       number;
  productLimit:      number;
  advancedAnalytics: boolean;
  supportLevel:      SupportLevel;
}

// ── Convenience helpers ───────────────────────────────────────────────────────

/** Returns true when the plan is PRO or ENTERPRISE. */
export function isPaidPlan(type: SubscriptionType): boolean {
  return type === 'PRO' || type === 'ENTERPRISE';
}

/** Returns true when the plan is ENTERPRISE. */
export function isEnterprisePlan(type: SubscriptionType): boolean {
  return type === 'ENTERPRISE';
}
