// ── Shared types for AI Insight payloads ──────────────────────────────────────

export type ForecastPoint = {
  label:     string;
  actual?:   number | null;
  predicted?: number | null;
};

// ── Product Analysis ──────────────────────────────────────────────────────────

export type ProductDemandItem = {
  name:          string;
  status:        'High Demand' | 'Stable' | 'Declining';
  changePercent: number;
  confidence:    number;
};

export type ProductPayload = {
  summary:         string;
  confidenceLevel: number;
  topProducts:     ProductDemandItem[];
  forecastPoints:  ForecastPoint[];
  recommendations: string[];
};

// ── Sales Analysis ────────────────────────────────────────────────────────────

export type SalesMetricItem = {
  title:       string;
  amount?:     number;
  value?:      string;
  progressPct: number;
  pillText:    string;
  subtitle?:   string;
};

export type SalesPayload = {
  summary:         string;
  predictedGrowth: number;
  confidenceLevel: number;
  forecastPoints:  ForecastPoint[];
  metrics:         SalesMetricItem[];
  recommendations: string[];
};

// ── Customer Analysis ─────────────────────────────────────────────────────────

export type PeakVisitDay = {
  id:      string;
  label:   string;
  percent: number;
};

export type CustomerStats = {
  avgCustomerValue:       number;
  predictedNewCustomers:  number;
  churnRisk:              number;
};

export type BranchDistributionItem = {
  branchName:      string;
  customerCount:   number;
  predictedGrowth: number;
};

export type CustomerPayload = {
  summary:         string;
  predictedGrowth: number;
  confidenceLevel: number;
  stats:           CustomerStats;
  forecastPoints:  ForecastPoint[];
  branchBreakdown: BranchDistributionItem[];
  peakVisitDays:   PeakVisitDay[];
  recommendations: string[];
};

// ── Branch Analysis ───────────────────────────────────────────────────────────

export type BranchItem = {
  branchName:        string;
  currentSale:       number;
  predictedSale:     number;
  efficiencyPercent: number;
  highlighted?:      boolean;
};

export type BranchPayload = {
  summary:         string;
  predictedGrowth: number;
  confidenceLevel: number;
  forecastPoints:  ForecastPoint[];
  branches:        BranchItem[];
  topBranch:       string;
  recommendations: string[];
};

// ── Staff Analysis ────────────────────────────────────────────────────────────

export type StaffCashierItem = {
  id:              string;
  name:            string;
  branchName:      string;
  revenue:         number;
  orderCount:      number;
  avgOrderValue:   number;
  productivityPct: number;
  efficiencyPct:   number;
  badgeText:       string;
  badgeTone:       'orange' | 'green';
  aiCallout:       string;
};

export type StaffPayload = {
  summary:         string;
  confidenceLevel: number;
  cashiers:        StaffCashierItem[];
  recommendations: string[];
};

// ── Generic insight response ──────────────────────────────────────────────────

export type AiInsightResponse<T> = {
  id:          string;
  type:        string;
  branchId:    string | null;
  payload:     T;
  confidence:  number;
  generatedAt: string;
} | null;
