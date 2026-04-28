export interface StatCard {
    title: string;
    value?: string;
    amount?: number;
    percentage: string;
    trend: 'up' | 'down';
    caption: string;
}

export interface SalesLine {
    day: string;
    coffeetalk: number;
    lowSlow: number;
    coldBrew: number;
    eplus: number;
    sinergy: number;
}

export interface SalesBar {
    hour: string;
    value: number;
}

export interface TopSellingItem {
    id: number;
    name: string;
    image: string;
    price: number;
    percentage: string;
    trend: 'up' | 'down';
}

export interface StaffPerformance {
    id: number;
    name: string;
    avatar: string;
    amount: number;
    subAmount: number;
}

// ── New: date-range-aware overview types ──────────────────────────────────────

export interface DateRangeParams {
    startDate?: string;
    endDate?:   string;
    branchId?:  string;
}

export interface OverviewStats {
    totalRevenue:   { value: number; pctChange: number };
    totalOrders:    { value: number; pctChange: number };
    totalCustomers: { value: number; newInPeriod: number; pctChange: number };
    totalExpenses:  { value: number; pctChange: number };
    lowStockCount:  number;
}

export interface TopSellingProduct {
    variantId:  string;
    name:       string;
    image:      string;
    revenue:    number;
    orderCount: number;
    pctChange:  number;
    trend:      'up' | 'down';
}

export interface StaffPerformanceRow {
    cashierId:  string;
    cashierNo:  string;
    name:       string;
    imgUrl:     string | null;
    branchName: string;
    revenue:    number;
    orderCount: number;
}

// ── Chart types ───────────────────────────────────────────────────────────────

export interface SalesChartSeries {
    variantId: string;
    name:      string;
    data:      number[];
}

export interface SalesChartData {
    days:   string[];          // ISO date strings e.g. "2024-03-15"
    series: SalesChartSeries[];
}

export interface SalesReportRow {
    day:        string;        // ISO date string
    revenue:    number;
    orderCount: number;
}

// ── Profit report types ───────────────────────────────────────────────────────

/** One row in the profit table — maps to one completed order */
export interface ProfitRow {
    orderId:        string;
    orderNumber:    string;
    date:           string;           // ISO datetime string
    branchName:     string;
    paymentMethod:  'CASH' | 'CARD' | 'SPLIT';
    revenue:        number;           // Order.subTotal (pre-discount selling price)
    discountAmount: number;           // Order-level discount applied
    cogs:           number;           // Σ(basePriceAtSale × quantity) across items
    grossProfit:    number;           // revenue − cogs − discountAmount
    marginPct:      number;           // (grossProfit / revenue) × 100
}

export interface ProfitStatValue {
    value:     number;
    pctChange: number;              // vs equal prior period
}

export interface ProfitSummary {
    totalRevenue: ProfitStatValue;
    totalCogs:    ProfitStatValue;
    grossProfit:  ProfitStatValue;
    avgMarginPct: ProfitStatValue;
}

export interface ProfitPagination {
    total:      number;
    page:       number;
    limit:      number;
    totalPages: number;
}

export interface ProfitReportResponse {
    rows:       ProfitRow[];
    summary:    ProfitSummary;
    pagination: ProfitPagination;
}
export interface ProfitBranchOption {
    id:   string;
    name: string;
}
