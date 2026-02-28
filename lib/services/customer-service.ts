import { apiClient } from '@/lib/api-client';
import { customersData } from '@/lib/mocks/customermanagement';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '@/types/customer.types';

export type { Customer, CreateCustomerInput, UpdateCustomerInput };

export const customerService = {
    getAll: (): Promise<Customer[]> =>
        apiClient.get<Customer[]>('/api/v1/customers').then(res => res.data).catch(() => customersData),

    getById: (id: string): Promise<Customer> =>
        apiClient.get<Customer>(`/api/v1/customers/${id}`).then(res => res.data),

    create: (data: CreateCustomerInput): Promise<Customer> =>
        apiClient.post<Customer>('/api/v1/customers', data).then(res => res.data),

    update: (id: string, data: UpdateCustomerInput): Promise<Customer> =>
        apiClient.put<Customer>(`/api/v1/customers/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/api/v1/customers/${id}`).then(res => res.data),
};
