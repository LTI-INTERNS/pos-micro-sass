import { apiClient } from '@/lib/api-client';
import { Product, CreateProductInput, UpdateProductInput } from '@/types/product.types';

export type { Product, CreateProductInput, UpdateProductInput };

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// ── Helper: build per-branch stock map for admin/owner view ──────────────────
// For admin/owner (no branchId filter), variants carry ALL BranchVariant rows.
// This groups them into: { "Branch Name": { sku: { stockQty, ... }, ... } }
// so ViewProductPopup can show a "Stocked Branches" section.
function buildBranchesStock(variants: any[]): Record<string, any> {
    const map: Record<string, any> = {};
    for (const variant of variants) {
        for (const bv of variant.branchVariants ?? []) {
            const branchName = bv.branch?.name
                ? (bv.branch.city ? `${bv.branch.name} (${bv.branch.city})` : bv.branch.name)
                : bv.branchId;
            if (!map[branchName]) map[branchName] = {};
            map[branchName][variant.sku] = {
                stockQty:             Number(bv.stockQty ?? 0),
                stockUnit:            bv.stockUnit ?? 'Each',
                lowStock:             bv.lowStock  != null ? Number(bv.lowStock)  : null,
                available:            Boolean(bv.availability ?? true),
                basePriceOverride:    bv.priceOverride        != null ? Number(bv.priceOverride)        : null,
                sellingPriceOverride: bv.sellingPriceOverride != null ? Number(bv.sellingPriceOverride) : null,
                discount:             bv.discount  != null ? Number(bv.discount)  : null,
                taxRate:              bv.taxRate    != null ? Number(bv.taxRate)   : null,
            };
        }
    }
    return map;
}

// The backend returns variants with a `branchVariants` array.
// We pick the first entry (the current branch) and lift stockQty,
// lowStock, and availability up onto the variant so the table can read them.
function extractBranchStock(variant: any) {
    const bv = variant.branchVariants?.[0] ?? null;
    return {
        stockQty:             bv !== null ? Number(bv.stockQty ?? 0) : 0,
        lowStock:             bv !== null ? Number(bv.lowStock ?? 0) : 0,
        available:            bv !== null ? Boolean(bv.availability ?? true) : true,
        // Branch-level price overrides (null = use product base prices)
        priceOverride:        bv?.priceOverride        != null ? Number(bv.priceOverride)        : null,
        sellingPriceOverride: bv?.sellingPriceOverride != null ? Number(bv.sellingPriceOverride) : null,
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
    // Build branchesStock from raw variants BEFORE mapVariant strips branchVariants
    const branchesStock = buildBranchesStock(p.variants ?? []);

    return {
        ...p,
        id: p.productId || p.id,
        brand: p.brandName || p.brand || undefined,
        categoryId: p.categoryId || p.category?.categoryId || '',
        category:
            typeof p.category === 'object' && p.category !== null
                ? p.category.categoryName
                : p.category || '',
        options: (p.options ?? []).map((opt: any) => {
            const values = (opt.values ?? []).map((v: any) => {
                // Handle both direct string values and { value, ... } structure
                if (typeof v === 'string') return v;
                if (v && typeof v === 'object' && v.value) return v.value;
                return '';
            }).filter((v: string) => v.trim() !== '');

            return {
                ...opt,
                // Backend stores the option label as `optionName` (enum); frontend expects `name`
                name: opt.optionName ?? opt.name ?? '',
                id: opt.optionId ?? opt.id,
                values,
            };
        }),
        variants: (p.variants ?? []).map(mapVariant),
        // Attach branch stock map for admin/owner popup
        // Only populated when branchId is not filtered (i.e. admin/owner view)
        branchesStock: Object.keys(branchesStock).length > 0 ? branchesStock : undefined,
    };
}

export const productService = {
    getAll: (params?: {
        search?: string;
        categoryId?: string;
        status?: string;
        branchId?: string;
        page?: number;
        limit?: number;
    }): Promise<Product[]> =>
        apiClient
            .get<ApiResponse<Product[]>>('/products', { params })
            .then(res => (res.data?.data ?? []).map(mapProduct)),

    // Returns ALL company products regardless of branch — used by the manager
    // "Add from Company Catalog" popup so they can see every product to stock.
    getCatalog: (): Promise<Product[]> =>
        apiClient
            .get<ApiResponse<Product[]>>('/products', { params: { catalog: true } })
            .then(res => (res.data?.data ?? []).map(mapProduct)),

    getById: (id: string): Promise<Product> =>
        apiClient
            .get<ApiResponse<Product>>(`/products/${id}`)
            .then(res => mapProduct(res.data.data)),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient
            .post<ApiResponse<Product>>('/products', data)
            .then(res => mapProduct(res.data.data)),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient
            .patch<ApiResponse<Product>>(`/products/${id}`, data)
            .then(res => res.data.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(() => undefined),
};