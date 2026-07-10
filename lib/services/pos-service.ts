import { apiClient } from '@/lib/api-client';

export interface PosProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
    barcode?: string;
    availability: boolean;
    stockQty: number; // Added to track available stock for negative stock alerts
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

interface OptionValue {
    value?: {
        value?: string;
    };
}

interface BranchVariant {
    sellingPriceOverride?: string | number | null;
    stockQty?: string | number;
    availability?: boolean;
}

interface ProductVariant {
    variantId: string;
    optionValues?: OptionValue[];
    sellingPrice?: string | number;
    branchVariants?: BranchVariant[];
    imageUrl?: string;
    barcode?: string;
}

interface BackendPosProduct {
    name: string;
    imageUrl?: string;
    variants?: ProductVariant[];
}

export const posService = {
    getProducts: (params?: { search?: string; limit?: number }): Promise<PosProduct[]> =>
        apiClient
            .get<ApiResponse<BackendPosProduct[]>>('/products', { params })
            .then(res => {
                const products = res.data?.data ?? [];
                const posProducts: PosProduct[] = [];

                for (const p of products) {
                    if (!p.variants || p.variants.length === 0) continue;

                    for (const v of p.variants) {
                        // Extract option values if any
                        const optionString = v.optionValues
                            ?.map((ov: OptionValue) => ov.value?.value)
                            .filter(Boolean)
                            .join(' - ') || '';

                        const name = optionString ? `${p.name} (${optionString})` : p.name;
                        
                        // Extract price and stock with branch override if available
                        let price = Number(v.sellingPrice) || 0;
                        let stockQty = 0;
                        let availability = true;
                        if (v.branchVariants && v.branchVariants.length > 0) {
                            const bv = v.branchVariants[0];
                            const branchOverride = bv.sellingPriceOverride;
                            if (branchOverride !== null && branchOverride !== undefined) {
                                price = Number(branchOverride);
                            }
                            stockQty = Number(bv.stockQty) || 0;
                            availability = Boolean(bv.availability ?? true);
                        }

                        posProducts.push({
                            id: v.variantId,
                            name,
                            price,
                            stockQty,
                            availability,
                            image: v.imageUrl || p.imageUrl || '',
                            barcode: v.barcode || '',
                        });
                    }
                }
                return posProducts;
            }),

    createOrder: (data: unknown) =>
        apiClient.post<ApiResponse<unknown>>('/orders', data).then(res => res.data.data),
};