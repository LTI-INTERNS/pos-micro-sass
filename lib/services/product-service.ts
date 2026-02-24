import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';

export type { Product, CreateProductInput, UpdateProductInput };

export const productService = {
    getAll: (): Promise<Product[]> =>
        apiClient.get<Product[]>('/products').then(res => res.data).catch(() => productsData),

    getById: (id: string): Promise<Product> =>
        apiClient.get<Product>(`/products/${id}`).then(res => res.data),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient.post<Product>('/products', data).then(res => res.data),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient.put<Product>(`/products/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(res => res.data),
};
