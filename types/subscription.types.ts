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
  priceMonthly:      number;
  branchLimit:       number | null;
  staffLimit:        number | null; // staff accounts = cashiers only
  productLimit:      number | null; // product count = product variants
  customerLimit:     number | null;
  monthlyOrderLimit: number | null; // monthly order count is per branch
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

/** Returns true when AI Prediction is available for the plan. */
export function hasAIPrediction(level?: AIPredictionLevel): boolean {
  return level === 'INCLUDED' || level === 'FULL_SUITE';
}
