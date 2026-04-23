import { apiClient } from '@/lib/api-client';
import {
    statCards,
    salesLineData,
    salesBarData,
    topSellingItemsData,
    staffReportData,
} from '@/lib/mocks/overview/mockData';
import type {
    StatCard,
    SalesLine,
    SalesBar,
    TopSellingItem,
    StaffPerformance,
    DateRangeParams,
    OverviewStats,
    TopSellingProduct,
    StaffPerformanceRow,
} from '@/types/analytics.types';

// ── Helper ────────────────────────────────────────────────────────────────────

function toParams(range?: DateRangeParams): Record<string, string> {
    const p: Record<string, string> = {};
    if (range?.startDate) p.startDate = range.startDate;
    if (range?.endDate)   p.endDate   = range.endDate;
    if (range?.branchId)  p.branchId  = range.branchId;
    return p;
}

interface BackendEnvelope<T> {
    success: boolean;
    data:    T;
}

// ── Legacy service (unchanged — used by chart components) ─────────────────────

export const analyticsService = {
    getStats: (): Promise<StatCard[]> =>
        apiClient.get<StatCard[]>('/analytics/stats').then(res => res.data).catch(() => statCards as unknown as StatCard[]),

    getSalesLine: (): Promise<SalesLine[]> =>
        apiClient.get<SalesLine[]>('/analytics/sales-line').then(res => res.data).catch(() => salesLineData as SalesLine[]),

    getSalesBar: (): Promise<SalesBar[]> =>
        apiClient.get<SalesBar[]>('/analytics/sales-bar').then(res => res.data).catch(() => salesBarData as SalesBar[]),

    getTopSelling: (): Promise<TopSellingItem[]> =>
        apiClient.get<TopSellingItem[]>('/analytics/top-selling').then(res => res.data).catch(() => topSellingItemsData as unknown as TopSellingItem[]),

    getStaffPerformance: (): Promise<StaffPerformance[]> =>
        apiClient.get<StaffPerformance[]>('/analytics/staff-performance').then(res => res.data).catch(() => staffReportData as StaffPerformance[]),
};

// ── New date-range aware overview service ─────────────────────────────────────

const EMPTY_STATS: OverviewStats = {
    totalRevenue:   { value: 0, pctChange: 0 },
    totalOrders:    { value: 0, pctChange: 0 },
    totalCustomers: { value: 0, newInPeriod: 0, pctChange: 0 },
    totalExpenses:  { value: 0, pctChange: 0 },
    lowStockCount:  0,
};

export const overviewAnalyticsService = {
    /**
     * GET /api/v1/analytics/overview-stats
     * Fetches all four stat cards + low-stock count in one request.
     */
    getOverviewStats: (range?: DateRangeParams): Promise<OverviewStats> =>
        apiClient
            .get<BackendEnvelope<OverviewStats>>('/analytics/overview-stats', {
                params: toParams(range),
            })
            .then(res => res.data.data)
            .catch(() => EMPTY_STATS),

    /**
     * GET /api/v1/analytics/top-selling
     * Top-selling products for the selected date window.
     */
    getTopSelling: (range?: DateRangeParams, limit = 10): Promise<TopSellingProduct[]> =>
        apiClient
            .get<BackendEnvelope<TopSellingProduct[]>>('/analytics/top-selling', {
                params: { ...toParams(range), limit },
            })
            .then(res => res.data.data)
            .catch((): TopSellingProduct[] => []),

    /**
     * GET /api/v1/analytics/staff-performance
     * Cashier leaderboard for the selected date window.
     */
    getStaffPerformance: (range?: DateRangeParams, limit = 10): Promise<StaffPerformanceRow[]> =>
        apiClient
            .get<BackendEnvelope<StaffPerformanceRow[]>>('/analytics/staff-performance', {
                params: { ...toParams(range), limit },
            })
            .then(res => res.data.data)
            .catch((): StaffPerformanceRow[] => []),
};
