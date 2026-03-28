export interface ProductOptionValue {
    optionName: string;
    value: string;
}

export interface ProductVariant {
    sku: string;
    price: number;
    imageUrl?: string;
    optionValues?: ProductOptionValue[];
}

export interface ProductOption {
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
    supplier: string;
    status?: string;
    image?: string;
    description?: string;
    options: ProductOption[];
    variants: ProductVariant[];
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Partial<CreateProductInput>;