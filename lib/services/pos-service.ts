import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';
import { Product } from '@/types/product.types';

// Roles that see ALL branches' products
const GLOBAL_ROLES = ['admin', 'owner', 'Admin', 'Owner'];

export interface PosProduct {
    id: string;
    name: string;
    price: number;
    image?: string;
    category?: string;
    stock?: number;
    branchId?: string;
}

export interface CreatePosOrderPayload {
    orderNo: string;
    branchId: string | null;
    cashierName: string;
    customerId?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    items: {
        productId: string;
        name: string;
        qty: number;
        unitPrice: number;
        subtotal: number;
    }[];
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    change: number;
    receiptEmail?: string | null;
}

/**
 * Fetch products scoped by role:
 *  - admin / owner  → GET /api/v1/products  (all branches)
 *  - manager / cashier → GET /api/v1/products?branchId=<id>
 */
export const posService = {
    getProducts: async (role: string, branchId: string | null): Promise<PosProduct[]> => {
        try {
            const isGlobal = GLOBAL_ROLES.includes(role);
            const url = isGlobal
                ? '/api/v1/products'
                : `/api/v1/products?branchId=${branchId}`;

            const res = await apiClient.get<Product[]>(url);
            const data: Product[] = res.data;

            return data.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: p.image,
                category: p.category,
                stock: p.stock,
            }));
        } catch {
            // Fallback to mock data so POS never goes blank
            return productsData.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                image: undefined,
                category: p.category,
                stock: p.stock,
            }));
        }
    },

    createOrder: async (payload: CreatePosOrderPayload): Promise<{ id: string; orderNo: string }> => {
        const res = await apiClient.post<{ id: string; orderNo: string }>(
            '/api/v1/orders',
            payload
        );
        return res.data;
    },
};
