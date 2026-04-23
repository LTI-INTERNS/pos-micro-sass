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
