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
            .then(res => {
                const data = res.data?.data ?? [];
                return data.map((p: any) => ({
                    ...p,
                    id: p.productId || p.id,
                    categoryId: p.categoryId || (p.category?.categoryId) || '',
                    category: typeof p.category === 'object' && p.category !== null ? p.category.categoryName : (p.category || ''),
                    options: (p.options ?? []).map((opt: any) => ({
                        ...opt,
                        values: opt.values.map((v: any) => (typeof v === 'object' && v !== null ? v.value : v))
                    })),
                    variants: (p.variants ?? []).map((variant: any) => ({
                        ...variant,
                        price: Number(variant.sellingPrice || variant.basePrice || variant.price || 0),
                        optionValues: (variant.optionValues ?? []).map((ov: any) => {
                            if (ov && ov.value && ov.value.option) {
                                return { optionName: ov.value.option.optionName, value: ov.value.value };
                            }
                            // Fallback if it already matches the expected frontend structure
                            return ov;
                        })
                    }))
                }));
            }),

    getById: (id: string): Promise<Product> =>
        apiClient.get<ApiResponse<Product>>(`/products/${id}`).then(res => {
            const p = res.data.data as any;
            return {
                ...p,
                id: p.productId || p.id,
                categoryId: p.categoryId || (p.category?.categoryId) || '',
                category: typeof p.category === 'object' && p.category !== null ? p.category.categoryName : (p.category || ''),
                options: (p.options ?? []).map((opt: any) => ({
                    ...opt,
                    values: opt.values.map((v: any) => (typeof v === 'object' && v !== null ? v.value : v))
                })),
                variants: (p.variants ?? []).map((variant: any) => ({
                    ...variant,
                    price: Number(variant.sellingPrice || variant.basePrice || variant.price || 0),
                    optionValues: (variant.optionValues ?? []).map((ov: any) => {
                        if (ov && ov.value && ov.value.option) {
                            return { optionName: ov.value.option.optionName, value: ov.value.value };
                        }
                        return ov;
                    })
                }))
            };
        }),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient.post<ApiResponse<Product>>('/products', data).then(res => res.data.data),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient.patch<ApiResponse<Product>>(`/products/${id}`, data).then(res => res.data.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(() => undefined),
};