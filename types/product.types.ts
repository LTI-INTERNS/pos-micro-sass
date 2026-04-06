export interface ProductOptionValue {
    optionName: string;
    value: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number;
    basePrice?: string;
    sellingPrice?: string;
    sellUnit?: string;
    imageUrl?: string;
    barcode?: string;
    optionValues?: ProductOptionValue[];
    // ── Branch-level fields (populated from BranchVariant by the service) ──
    stockQty?: number;       // ← ADDED: mapped from branchVariant.stockQty
    lowStock?: number;       // ← ADDED: mapped from branchVariant.lowStock
    available?: boolean;     // ← ADDED: mapped from branchVariant.availability
}

export interface ProductOption {
    id: number;
    name: string;
    values: string[];
}

export interface Product {
    id: string;
    name: string;
    price: number;
    discount: number;
    tax: number;
    stock: number;
    lowstock: number;
    category: string;
    categoryId?: string;
    supplier?: string;
    status?: string;
    image?: string;
    description?: string;
    options: ProductOption[];
    variants: ProductVariant[];
    companyId?: string;
}

export type CreateProductInput = {
    name: string;
    categoryId: string;
    companyId?: string;
    brand: string;
    description: string;
    options: ProductOption[];
    variants: ProductVariant[];
};

export type UpdateProductInput = Partial<CreateProductInput>;