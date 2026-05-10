import { apiClient } from '@/lib/api-client';
import type {
    ProductPayload,
    SalesPayload,
    CustomerPayload,
    BranchPayload,
    StaffPayload,
    AiInsightResponse,
} from '@/types/ai-insight.types';

interface Envelope<T> { success: boolean; data: T; }

function get<T>(path: string, branchId?: string) {
    return apiClient
        .get<Envelope<AiInsightResponse<T>>>(path, { params: branchId ? { branchId } : {} })
        .then(res => res.data.data);
}

function post<T>(path: string, branchId?: string) {
    return apiClient
        .post<Envelope<AiInsightResponse<T>>>(path, {}, { params: branchId ? { branchId } : {} })
        .then(res => res.data.data);
}

export const aiInsightService = {
    // Product
    getProductInsight:      (branchId?: string) => get<ProductPayload>('/ai-insights/product', branchId),
    generateProductInsight: (branchId?: string) => post<ProductPayload>('/ai-insights/product', branchId),

    // Sales
    getSalesInsight:        (branchId?: string) => get<SalesPayload>('/ai-insights/sales', branchId),
    generateSalesInsight:   (branchId?: string) => post<SalesPayload>('/ai-insights/sales', branchId),

    // Customer
    getCustomerInsight:      (branchId?: string) => get<CustomerPayload>('/ai-insights/customer', branchId),
    generateCustomerInsight: (branchId?: string) => post<CustomerPayload>('/ai-insights/customer', branchId),

    // Branch
    getBranchInsight:      (branchId?: string) => get<BranchPayload>('/ai-insights/branch', branchId),
    generateBranchInsight: (branchId?: string) => post<BranchPayload>('/ai-insights/branch', branchId),

    // Staff
    getStaffInsight:      (branchId?: string) => get<StaffPayload>('/ai-insights/staff', branchId),
    generateStaffInsight: (branchId?: string) => post<StaffPayload>('/ai-insights/staff', branchId),
};
