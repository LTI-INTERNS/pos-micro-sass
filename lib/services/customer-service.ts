import { apiClient } from '@/lib/api-client';
import type {
    Customer,
    BackendCustomer,
    CreateCustomerInput,
    UpdateCustomerInput,
} from '@/types/customer.types';
import type { ApiResponse } from '@/types/api.types';

export type { Customer, CreateCustomerInput, UpdateCustomerInput };

// ── Mapper: backend shape → frontend Customer ─────────────────────────────────

function mapCustomer(raw: BackendCustomer): Customer {
    return {
        id:          raw.customerId,
        name:        raw.name,
        email:       raw.email,
        promoCard:   raw.promocard,
        activeState: raw.activeState,
        createdAt:   raw.createdAt,
        updatedAt:   raw.updatedAt,
        branch:      raw.branch,
        phones:      raw.phones,
        loyalty:     raw.loyalty,
        // Convenience fields
        phone:       raw.phones[0]?.phone1 ?? '',
        points:      raw.loyalty?.pointsBalance ?? 0,
    };
}

// ── Backend success envelope ──────────────────────────────────────────────────

interface BackendResponse<T> {
    success: boolean;
    data:    T;
}

// ── Stats type ───────────────────────────────────────────────────────────────

export interface CustomerStats {
    total:        { value: number; pctChange: number };
    newThisMonth: { value: number; pctChange: number };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const customerService = {

    /**
     * GET /api/v1/customers
     */
    getAll: (branchId?: string): Promise<Customer[]> =>
        apiClient
            .get<BackendResponse<BackendCustomer[]>>('/customers', {
                params: branchId ? { branchId } : undefined,
            })
            .then(res => res.data.data.map(mapCustomer)),

    /**
     * GET /api/v1/customers/search?q=...&branchId=...
     */
    search: (query: string, branchId?: string): Promise<Customer[]> =>
        apiClient
            .get<BackendResponse<BackendCustomer[]>>('/customers/search', {
                params: { q: query, ...(branchId ? { branchId } : {}) },
            })
            .then(res => res.data.data.map(mapCustomer)),

    /**
     * GET /api/v1/customers/:customerId
     */
    getById: (customerId: string): Promise<Customer> =>
        apiClient
            .get<BackendResponse<BackendCustomer>>(`/customers/${customerId}`)
            .then(res => mapCustomer(res.data.data)),

    /**
     * POST /api/v1/customers
     */
    create: (data: CreateCustomerInput): Promise<Customer> =>
        apiClient
            .post<BackendResponse<BackendCustomer>>('/customers', data)
            .then(res => mapCustomer(res.data.data)),

    /**
     * PATCH /api/v1/customers/:customerId
     */
    update: (customerId: string, data: UpdateCustomerInput): Promise<Customer> =>
        apiClient
            .patch<BackendResponse<BackendCustomer>>(`/customers/${customerId}`, data)
            .then(res => mapCustomer(res.data.data)),

    /**
     * PATCH /api/v1/customers/:customerId (email only)
     */
    updateEmail: (customerId: string, email: string): Promise<Customer> =>
        apiClient
            .patch<BackendResponse<BackendCustomer>>(`/customers/${customerId}`, { email })
            .then(res => mapCustomer(res.data.data)),

    /**
     * DELETE /api/v1/customers/:customerId  (soft-delete)
     */
    remove: (customerId: string): Promise<void> =>
        apiClient
            .delete(`/customers/${customerId}`)
            .then(() => undefined),
    /**
     * GET /api/v1/customers/stats
     */
    getStats: (branchId?: string): Promise<CustomerStats> =>
        apiClient
            .get<BackendResponse<CustomerStats>>('/customers/stats', {
                params: branchId ? { branchId } : undefined,
            })
            .then(res => res.data.data),

};