export interface ProductOptionValue {
    optionName: string;
    value: string;
}

export interface ProductVariant {
    id: number;
    sku: string;
    price: number; // Keep for backward compatibility if needed, or replace with base/selling
    basePrice?: string;
    sellingPrice?: string;
    sellUnit?: string;
    imageUrl?: string;
    barcode?: string;
    optionValues?: ProductOptionValue[];
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
    supplier: string;
    status?: string;
    image?: string;
    description?: string;
    options: ProductOption[];
    variants: ProductVariant[];
    companyId?: string; // Add companyId
}

// Ensure the create payload matches the backend definition exactly
export type CreateProductInput = {
    name: string;
    categoryId: string; // The backend expects categoryId
    companyId?: string; // Optional since the backend injects it from the session token
    brand: string;
    description: string;
    options: ProductOption[];
    variants: ProductVariant[];
};

export type UpdateProductInput = Partial<CreateProductInput>;