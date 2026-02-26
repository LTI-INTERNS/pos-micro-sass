import { apiClient } from '@/lib/api-client';

export interface Customer {
    id:          string;
    name:        string;
    phone:       string;
    phone2:      string | null;
    email:       string | null;
    points:      number;
    outstanding: number;
    promoCard:   string | null;
    createdAt:   string;
}

export interface CreateCustomerInput {
    name:   string;
    phone:  string;
    phone2?: string;
    email?: string;
}

interface CustomersResponse {
    success: boolean;
    data:    Customer[];
    meta: {
        total:      number;
        page:       number;
        limit:      number;
        totalPages: number;
    };
}

export const customerService = {
    getAll: (params?: { search?: string; page?: number; limit?: number }): Promise<Customer[]> =>
        apiClient
            .get<CustomersResponse>('/customers', { params })
            .then((res) => res.data.data)
            .catch(() => []),

    search: (query: string): Promise<Customer[]> =>
        apiClient
            .get<CustomersResponse>('/customers', { params: { search: query, limit: 20 } })
            .then((res) => res.data.data)
            .catch(() => []),

    getById: (id: string): Promise<Customer | null> =>
        apiClient
            .get<{ success: boolean; data: Customer }>(`/customers/${id}`)
            .then((res) => res.data.data)
            .catch(() => null),

    create: (data: CreateCustomerInput): Promise<Customer> =>
        apiClient
            .post<{ success: boolean; data: Customer }>('/customers', data)
            .then((res) => res.data.data),

    update: (id: string, data: Partial<CreateCustomerInput>): Promise<Customer> =>
        apiClient
            .patch<{ success: boolean; data: Customer }>(`/customers/${id}`, data)
            .then((res) => res.data.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/customers/${id}`).then(() => undefined),
};