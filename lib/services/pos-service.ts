import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';

export interface PosProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const posService = {
    getProducts: (params?: { search?: string; limit?: number }): Promise<PosProduct[]> =>
        apiClient
            .get<ApiResponse<PosProduct[]>>('/products', { params })
            .then(res => res.data?.data ?? [])
            .catch(() => productsData.map(p => ({ id: p.id, name: p.name, price: p.price }))),

    createOrder: (data: unknown) =>
        apiClient.post<ApiResponse<unknown>>('/orders', data).then(res => res.data.data),
};