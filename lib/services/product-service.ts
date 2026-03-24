import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';

export type { Product, CreateProductInput, UpdateProductInput };

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const productService = {
    getAll: (params?: { search?: string; categoryId?: string; status?: string; page?: number; limit?: number }): Promise<Product[]> =>
        apiClient
            .get<ApiResponse<Product[]>>('/products', { params })
            .then(res => res.data?.data ?? [])
            .catch(() => productsData as unknown as Product[]),

    getById: (id: string): Promise<Product> =>
        apiClient.get<ApiResponse<Product>>(`/products/${id}`).then(res => res.data.data),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient.post<ApiResponse<Product>>('/products', data).then(res => res.data.data),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data).then(res => res.data.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(() => undefined),
};