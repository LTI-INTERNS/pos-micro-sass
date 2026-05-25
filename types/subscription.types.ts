// ── Enums (mirror the Prisma schema exactly) ──────────────────────────────────

export type BusinessTypeEnum =
  | 'CAFE'
  | 'CLOTHING'
  | 'SUPERMARKET'
  | 'PHARMACY'
  | 'HARDWARE'
  | 'BOOKSHOP';

export type SubscriptionType = 'FREE' | 'PRO' | 'ENTERPRISE';
export type SupportLevel = 'EMAIL' | 'PRIORITY' | 'DEDICATED_24_7';
export type ReportLevel = 'BASIC' | 'ADVANCED' | 'CUSTOM';
export type AIPredictionLevel = 'NOT_INCLUDED' | 'INCLUDED' | 'FULL_SUITE';

// ── Subscription shape returned by /auth/store-info ──────────────────────────

export interface SubscriptionInfo {
  type:              SubscriptionType;
  priceMonthly?:     string | number;
  branchLimit:       number | null;
  staffLimit:        number | null; // Cashiers per branch
  productLimit:      number | null; // Product variants
  customerLimit:     number | null;
  monthlyOrderLimit: number | null; // Orders per branch per month
  reportLevel:       ReportLevel;
  supportLevel:      SupportLevel;
  aiPredictionLevel: AIPredictionLevel;
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

export function hasAIPrediction(level?: AIPredictionLevel): boolean {
  return level === 'INCLUDED' || level === 'FULL_SUITE';
}
