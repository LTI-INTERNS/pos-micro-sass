import { apiClient } from '@/lib/api-client';
import { ordersData } from '@/lib/mocks/ordermanagement';
import { Order, CreateOrderInput, UpdateOrderInput } from '@/types/order.types';

export type { Order, CreateOrderInput, UpdateOrderInput };

export const orderService = {
    getAll: (): Promise<Order[]> =>
        apiClient.get<Order[]>('/orders').then(res => res.data).catch(() => ordersData),

    getById: (id: string): Promise<Order> =>
        apiClient.get<Order>(`/orders/${id}`).then(res => res.data),

    create: (data: CreateOrderInput): Promise<Order> =>
        apiClient.post<Order>('/orders', data).then(res => res.data),

    update: (id: string, data: UpdateOrderInput): Promise<Order> =>
        apiClient.put<Order>(`/orders/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/orders/${id}`).then(res => res.data),
};
