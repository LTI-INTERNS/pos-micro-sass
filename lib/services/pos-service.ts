import { apiClient } from '@/lib/api-client';

export interface PosProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
    barcode?: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

export const posService = {
    getProducts: (params?: { search?: string; limit?: number }): Promise<PosProduct[]> =>
        apiClient
            .get<ApiResponse<any[]>>('/products', { params })
            .then(res => {
                const products = res.data?.data ?? [];
                const posProducts: PosProduct[] = [];

                for (const p of products) {
                    if (!p.variants || p.variants.length === 0) continue;

                    for (const v of p.variants) {
                        // Extract option values if any
                        const optionString = v.optionValues
                            ?.map((ov: any) => ov.value?.value)
                            .filter(Boolean)
                            .join(' - ') || '';

                        const name = optionString ? `${p.name} (${optionString})` : p.name;

                        // Extract price with branch override if available
                        let price = Number(v.sellingPrice) || 0;
                        if (v.branchVariants && v.branchVariants.length > 0) {
                            const branchOverride = v.branchVariants[0].sellingPriceOverride;
                            if (branchOverride !== null && branchOverride !== undefined) {
                                price = Number(branchOverride);
                            }
                        }

                        posProducts.push({
                            id: v.variantId,
                            name,
                            price,
                            image: v.imageUrl || p.imageUrl || '',
                            barcode: v.barcode || '',
                        });
                    }
                }
                return posProducts;
            }),
            // No .catch() fallback — let ItemGrid handle the error state so the
            // cashier sees a clear "Failed to load" message instead of silently
            // receiving mock data with invalid variant IDs that break order creation.
};