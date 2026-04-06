import { apiClient } from '@/lib/api-client';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';

export type { Product, CreateProductInput, UpdateProductInput };

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// ── Helper: extract branch-level stock fields from a raw variant ──────────────
// The backend returns variants with a `branchVariants` array.
// We pick the first entry (the current branch) and lift stockQty,
// lowStock, and availability up onto the variant so the table can read them.
function extractBranchStock(variant: any) {
    const bv = variant.branchVariants?.[0] ?? null;
    return {
        stockQty: bv !== null ? Number(bv.stockQty ?? 0) : 0,
        lowStock: bv !== null ? Number(bv.lowStock ?? 0) : 0,
        available: bv !== null ? Boolean(bv.availability ?? true) : true,
    };
}

// ── Helper: map raw option values from the backend shape ─────────────────────
function mapOptionValues(optionValues: any[]) {
    return (optionValues ?? []).map((ov: any) => {
        if (ov && ov.value && ov.value.option) {
            return { optionName: ov.value.option.optionName, value: ov.value.value };
        }
        return ov;
    });
}

// ── Helper: map a raw variant from the API to the frontend ProductVariant ─────
function mapVariant(variant: any) {
    return {
        ...variant,
        price: Number(variant.sellingPrice || variant.basePrice || variant.price || 0),
        optionValues: mapOptionValues(variant.optionValues ?? []),
        ...extractBranchStock(variant),   // ← lifts stockQty, lowStock, available
    };
}

// ── Helper: map a raw product from the API to the frontend Product ────────────
function mapProduct(p: any): Product {
    return {
        ...p,
        id: p.productId || p.id,
        categoryId: p.categoryId || p.category?.categoryId || '',
        category:
            typeof p.category === 'object' && p.category !== null
                ? p.category.categoryName
                : p.category || '',
        options: (p.options ?? []).map((opt: any) => ({
            ...opt,
            values: opt.values.map((v: any) =>
                typeof v === 'object' && v !== null ? v.value : v
            ),
        })),
        variants: (p.variants ?? []).map(mapVariant),
    };
}

export const productService = {
    getAll: (params?: {
        search?: string;
        categoryId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<Product[]> =>
        apiClient
            .get<ApiResponse<Product[]>>('/products', { params })
            .then(res => (res.data?.data ?? []).map(mapProduct)),

    getById: (id: string): Promise<Product> =>
        apiClient
            .get<ApiResponse<Product>>(`/products/${id}`)
            .then(res => mapProduct(res.data.data)),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient
            .post<ApiResponse<Product>>('/products', data)
            .then(res => res.data.data),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient
            .patch<ApiResponse<Product>>(`/products/${id}`, data)
            .then(res => res.data.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(() => undefined),
};