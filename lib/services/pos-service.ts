import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';

export interface PosProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
    barcode?: string;
    stockQty: number; // Added to track available stock for negative stock alerts
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
                        
                        // Extract price and stock with branch override if available
                        let price = Number(v.sellingPrice) || 0;
                        let stockQty = 0;
                        if (v.branchVariants && v.branchVariants.length > 0) {
                            const bv = v.branchVariants[0];
                            const branchOverride = bv.sellingPriceOverride;
                            if (branchOverride !== null && branchOverride !== undefined) {
                                price = Number(branchOverride);
                            }
                            stockQty = Number(bv.stockQty) || 0;
                        }

                        posProducts.push({
                            id: v.variantId || p.productId, // Fallback just in case
                            name,
                            price,
                            stockQty,
                            image: v.imageUrl || p.imageUrl || '',
                            barcode: v.barcode || '',
                        });
                    }
                }
                return posProducts;
            })
            .catch(() => productsData.map(p => ({ 
                id: p.id, 
                name: p.name, 
                price: p.variants?.[0]?.price ?? 0,
                stockQty: 0
            }))),

    createOrder: (data: unknown) =>
        apiClient.post<ApiResponse<unknown>>('/orders', data).then(res => res.data.data),
};