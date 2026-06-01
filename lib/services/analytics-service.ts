import { apiClient } from '@/lib/api-client';
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
    SalesChartData,
    SalesReportRow,
    ProfitReportResponse,
    ProfitBranchOption,
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
        apiClient
            .get<StatCard[]>('/analytics/stats')
            .then(res => res.data)
            .catch((): StatCard[] => []),

    getSalesLine: (): Promise<SalesLine[]> =>
        apiClient
            .get<SalesLine[]>('/analytics/sales-line')
            .then(res => res.data)
            .catch((): SalesLine[] => []),

    getSalesBar: (): Promise<SalesBar[]> =>
        apiClient
            .get<SalesBar[]>('/analytics/sales-bar')
            .then(res => res.data)
            .catch((): SalesBar[] => []),

    getTopSelling: (): Promise<TopSellingItem[]> =>
        apiClient
            .get<TopSellingItem[]>('/analytics/top-selling')
            .then(res => res.data)
            .catch((): TopSellingItem[] => []),

    getStaffPerformance: (): Promise<StaffPerformance[]> =>
        apiClient
            .get<StaffPerformance[]>('/analytics/staff-performance')
            .then(res => res.data)
            .catch((): StaffPerformance[] => []),
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
    /**
     * GET /api/v1/analytics/sales-chart
     * Top-product revenue series for the Sales line chart.
     */
    getSalesChart: (range?: DateRangeParams, topN = 5): Promise<SalesChartData> =>
        apiClient
            .get<BackendEnvelope<SalesChartData>>('/analytics/sales-chart', {
                params: { ...toParams(range), topN },
            })
            .then(res => res.data.data)
            .catch((): SalesChartData => ({ days: [], series: [] })),

    /**
     * GET /api/v1/analytics/sales-bar
     * Hourly sales bars; supports optional date range params when backend supports it.
     * Note: some environments may return a plain array, others may return an envelope.
     */
    getSalesBar: (range?: DateRangeParams): Promise<SalesBar[]> =>
        apiClient
            .get<SalesBar[] | BackendEnvelope<SalesBar[]>>('/analytics/sales-bar', {
                params: toParams(range),
            })
            .then(res => {
                const payload = res.data;
                return Array.isArray(payload) ? payload : (payload.data ?? []);
            })
            .catch((): SalesBar[] => []),

    /**
     * GET /api/v1/analytics/sales-report
     * Daily total revenue for the Sales Report bar chart.
     */
    getSalesReport: (range?: DateRangeParams): Promise<SalesReportRow[]> =>
        apiClient
            .get<BackendEnvelope<SalesReportRow[]>>('/analytics/sales-report', {
                params: toParams(range),
            })
            .then(res => res.data.data)
            .catch((): SalesReportRow[] => []),

    /**
     * GET /api/v1/analytics/profit-report/branches
     * Branches that have completed orders in the selected date window.
     */
    getProfitReportBranches: (range?: DateRangeParams): Promise<ProfitBranchOption[]> =>
        apiClient
            .get<BackendEnvelope<ProfitBranchOption[]>>('/analytics/profit-report/branches', {
                params: toParams(range),
            })
            .then(res => res.data.data)
            .catch((): ProfitBranchOption[] => []),

    /**
     * GET /api/v1/analytics/profit-report

     * Per-order profit rows + aggregated summary (revenue, COGS, gross profit, margin).
     */
    getProfitReport: (
        range?: DateRangeParams,
        page   = 1,
        limit  = 50,
    ): Promise<ProfitReportResponse> =>
        apiClient
            .get<BackendEnvelope<ProfitReportResponse>>('/analytics/profit-report', {
                params: { ...toParams(range), page, limit },
            })
            .then(res => res.data.data)
            .catch((): ProfitReportResponse => ({
                rows:       [],
                summary: {
                    totalRevenue: { value: 0, pctChange: 0 },
                    totalCogs:    { value: 0, pctChange: 0 },
                    grossProfit:  { value: 0, pctChange: 0 },
                    avgMarginPct: { value: 0, pctChange: 0 },
                },
                pagination: { total: 0, page: 1, limit: 50, totalPages: 0 },
            })),

};