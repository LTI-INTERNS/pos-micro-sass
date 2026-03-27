import axios from 'axios';
import { getSession } from 'next-auth/react';
import { ordersData } from '@/lib/mocks/ordermanagement';
import { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order.types';

export type { Order, CreateOrderInput, UpdateOrderInput };

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

/** Dedicated axios instance pointing to /api/v1/sales (backend has no /orders route) */
const salesClient = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1',
});

salesClient.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const session = await getSession();
        if (session?.user?.branchId) config.headers['X-Company-ID'] = session.user.branchId;
        if (session?.user?.backendToken) config.headers['Authorization'] = `Bearer ${session.user.backendToken}`;
    }
    return config;
});

export const orderService = {
    getAll: (): Promise<Order[]> =>
        salesClient
            .get<ApiResponse<Order[]>>('/sales')
            .then(res => res.data?.data ?? [])
            .catch(() => ordersData),

    getById: (id: string): Promise<Order> =>
        salesClient.get<ApiResponse<Order>>(`/sales/${id}`).then(res => res.data.data),

    create: (data: CreateOrderInput): Promise<Order> =>
        salesClient.post<ApiResponse<Order>>('/sales', data).then(res => res.data.data),

    update: (id: string, data: UpdateOrderInput): Promise<Order> =>
        salesClient.patch<ApiResponse<Order>>(`/sales/${id}`, data).then(res => res.data.data),

    delete: (id: string): Promise<void> =>
        salesClient.delete(`/sales/${id}`).then(() => undefined),
};