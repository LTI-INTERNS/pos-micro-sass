import { apiClient } from '@/lib/api-client';
import { Product, CreateProductInput, UpdateProductInput, ProductOptionValue } from '@/types/product.types';

export type { Product, CreateProductInput, UpdateProductInput, ProductOptionValue };

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

interface RawBranch {
    name?: string;
    city?: string | null;
}

interface RawSupplier {
    type?: string;
    companyName?: string;
    name?: string;
}

interface RawBranchVariant {
    branch?: RawBranch | null;
    branchId?: string;
    stockQty?: string | number;
    stockUnit?: string;
    lowStock?: string | number | null;
    availability?: boolean;
    priceOverride?: string | number | null;
    sellingPriceOverride?: string | number | null;
    discount?: string | number | null;
    taxRate?: string | number | null;
    supplier?: RawSupplier | null;
    supplierId?: string | null;
    createdAt?: string | null;
}

interface RawOptionValue {
    value?: {
        option?: {
            optionName?: string;
        };
        value?: string;
    };
}

interface RawVariant {
    id?: string | number;
    sku: string;
    sellingPrice?: string | number;
    basePrice?: string | number;
    price?: string | number;
    branchVariants?: RawBranchVariant[];
    variantId?: string;
    imageUrl?: string;
    barcode?: string;
    optionValues?: RawOptionValue[];
}

interface RawOption {
    optionId?: string | number;
    id?: string | number;
    optionName?: string;
    name?: string;
    values?: (string | { value?: string } | null)[];
}

interface RawProduct {
    productId?: string;
    id?: string;
    brandName?: string;
    brand?: string;
    categoryId?: string;
    category?: string | { categoryId?: string; categoryName?: string } | null;
    options?: RawOption[];
    variants?: RawVariant[];
}

// ── Helper: build per-branch stock map for admin/owner view ──────────────────
// For admin/owner (no branchId filter), variants carry ALL BranchVariant rows.
// This groups them into: { "Branch Name": { sku: { stockQty, ... }, ... } }
// so ViewProductPopup can show a "Stocked Branches" section.
function buildBranchesStock(variants: RawVariant[]): Record<string, Record<string, unknown>> {
    const map: Record<string, Record<string, unknown>> = {};
    for (const variant of variants) {
        for (const bv of variant.branchVariants ?? []) {
            const branchName = bv.branch?.name
                ? (bv.branch.city ? `${bv.branch.name} (${bv.branch.city})` : bv.branch.name)
                : bv.branchId;
            if (!branchName) continue;
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
// lowStock, availability, and supplier up onto the variant so the table can read them.
function extractBranchStock(variant: RawVariant) {
    const bv = variant.branchVariants?.[0] ?? null;

    // Resolve a human-readable supplier name from the related supplier object
    let supplierName: string | undefined;
    if (bv?.supplier) {
        supplierName =
            bv.supplier.type === 'COMPANY'
                ? bv.supplier.companyName || bv.supplier.name
                : bv.supplier.name;
    }

    return {
        branchVariantCreatedAt:  bv?.createdAt ?? undefined,
        stockQty:             bv !== null ? Number(bv.stockQty ?? 0) : 0,
        lowStock:             bv !== null ? Number(bv.lowStock ?? 0) : 0,
        available:            bv !== null ? Boolean(bv.availability ?? true) : true,
        // Branch-level price overrides (null = use product base prices)
        priceOverride:        bv?.priceOverride        != null ? Number(bv.priceOverride)        : null,
        sellingPriceOverride: bv?.sellingPriceOverride != null ? Number(bv.sellingPriceOverride) : null,
        // Supplier info from the branch variant
        supplierId:   bv?.supplierId   ?? null,
        supplierName: supplierName     ?? null,
    };
}

// ── Helper: map raw option values from the backend shape ─────────────────────
function mapOptionValues(optionValues: RawOptionValue[]): ProductOptionValue[] {
    return (optionValues ?? []).map((ov) => {
        if (ov && ov.value && ov.value.option) {
            return {
                optionName: ov.value.option.optionName || '',
                value: ov.value.value || ''
            };
        }
        const rawOv = ov as unknown as Record<string, unknown>;
        return {
            optionName: String(rawOv?.optionName || ''),
            value: String(rawOv?.value || '')
        };
    });
}

// ── Helper: map a raw variant from the API to the frontend ProductVariant ─────
function mapVariant(variant: RawVariant) {
    return {
        ...variant,
        price: Number(variant.sellingPrice || variant.basePrice || variant.price || 0),
        basePrice: variant.basePrice !== undefined ? String(variant.basePrice) : undefined,
        sellingPrice: variant.sellingPrice !== undefined ? String(variant.sellingPrice) : undefined,
        optionValues: mapOptionValues(variant.optionValues ?? []),
        ...extractBranchStock(variant),   // ← lifts stockQty, lowStock, available
    };
}

// ── Helper: map a raw product from the API to the frontend Product ────────────
function mapProduct(p: RawProduct): Product {
    // Build branchesStock from raw variants BEFORE mapVariant strips branchVariants
    const branchesStock = buildBranchesStock(p.variants ?? []);

    // Derive a single supplier label from the first variant that has one.
    // For manager view (branchId-filtered) every variant has at most one BranchVariant,
    // so this reliably picks up the supplier assigned via Add Stock.
    const mappedVariantsForSupplier = (p.variants ?? []).map(extractBranchStock);
    const uniqueSuppliers = [
        ...new Set(
            mappedVariantsForSupplier
                .map((v) => v.supplierName)
                .filter(Boolean) as string[]
        ),
    ];
    const resolvedSupplier =
        uniqueSuppliers.length === 0   ? undefined
        : uniqueSuppliers.length === 1 ? uniqueSuppliers[0]
        : 'Multiple Suppliers';

    return {
        ...p,
        id: p.productId || p.id || '',
        name: (p as { name?: string }).name || '',
        price: (p as { price?: number }).price || 0,
        discount: (p as { discount?: number }).discount || 0,
        tax: (p as { tax?: number }).tax || 0,
        stock: (p as { stock?: number }).stock || 0,
        lowstock: (p as { lowstock?: number }).lowstock || 0,
        brand: p.brandName || p.brand || undefined,
        categoryId: p.categoryId || (p.category && typeof p.category === 'object' ? p.category.categoryId : '') || '',
        category:
            typeof p.category === 'object' && p.category !== null
                ? p.category.categoryName || ''
                : p.category || '',
        // Supplier resolved from the branch-variant layer
        supplier: resolvedSupplier,
        options: (p.options ?? []).map((opt) => {
            const values = (opt.values ?? []).map((v) => {
                // Handle both direct string values and { value, ... } structure
                if (typeof v === 'string') return v;
                if (v && typeof v === 'object' && v.value) return v.value;
                return '';
            }).filter((v: string) => v.trim() !== '');

            return {
                ...opt,
                // Backend stores the option label as `optionName` (enum); frontend expects `name`
                name: opt.optionName ?? opt.name ?? '',
                id: Number(opt.optionId ?? opt.id ?? 0),
                values,
            };
        }),
        variants: (p.variants ?? []).map(mapVariant).map(v => ({
            ...v,
            id: Number(v.variantId || v.id || 0)
        })),
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
            .get<ApiResponse<RawProduct[]>>('/products', { params })
            .then(res => (res.data?.data ?? []).map(mapProduct)),

    // Returns ALL company products regardless of branch — used by the manager
    // "Add from Company Catalog" popup so they can see every product to stock.
    getCatalog: (): Promise<Product[]> =>
        apiClient
            .get<ApiResponse<RawProduct[]>>('/products', { params: { catalog: true } })
            .then(res => (res.data?.data ?? []).map(mapProduct)),

    checkBarcode: (barcode: string): Promise<{ exists: boolean, productId?: string, productName?: string }> =>
        apiClient
            .get<ApiResponse<{ exists: boolean, productId?: string, productName?: string }>>('/products/check-barcode', { params: { barcode } })
            .then(res => res.data.data),

    getById: (id: string): Promise<Product> =>
        apiClient
            .get<ApiResponse<RawProduct>>(`/products/${id}`)
            .then(res => mapProduct(res.data.data)),

    create: (data: CreateProductInput): Promise<Product> =>
        apiClient
            .post<ApiResponse<RawProduct>>('/products', data)
            .then(res => mapProduct(res.data.data)),

    update: (id: string, data: UpdateProductInput): Promise<Product> =>
        apiClient
            .patch<ApiResponse<RawProduct>>(`/products/${id}`, data)
            .then(res => mapProduct(res.data.data)),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/products/${id}`).then(() => undefined),
};