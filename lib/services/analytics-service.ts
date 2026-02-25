import { apiClient } from '@/lib/api-client';
import { statCards, salesLineData, salesBarData, topSellingItemsData, staffReportData } from '@/lib/mocks/overview/mockData';
import { StatCard, SalesLine, SalesBar, TopSellingItem, StaffPerformance } from '@/types/analytics.types';

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
