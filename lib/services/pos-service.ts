import { apiClient } from '@/lib/api-client';

export interface PosProduct {
    id:         string;
    name:       string;
    price:      number;
    cost:       number;
    stock:      number;
    category:   string;
    supplier:   string;
    sku:        string | null;
    barcode:    string | null;
    image:      string | null;
}

interface ProductsResponse {
    success: boolean;
    data:    PosProduct[];
    meta: {
        total:      number;
        page:       number;
        limit:      number;
        totalPages: number;
    };
}

export const posService = {
    getProducts: (params?: { search?: string; categoryId?: string; page?: number; limit?: number }): Promise<PosProduct[]> =>
        apiClient
            .get<ProductsResponse>('/products', { params })
            .then((res) => res.data.data)
            .catch(() => []),

    createOrder: (data: unknown) => apiClient.post('/orders', data).then((res) => res.data),
};
