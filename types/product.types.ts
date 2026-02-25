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
}

export type CreateProductInput = Omit<Product, 'id'>;
export type UpdateProductInput = Partial<CreateProductInput>;
