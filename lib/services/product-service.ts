// import { apiClient } from '@/lib/api-client';
import { productsData } from '@/lib/mocks/productmanagement';

export const productService = {
    getProducts: async () => {
        // In production: return apiClient.get('/products').then(res => res.data);
        return productsData;
    },
    getProductById: async (id: string) => {
        return productsData.find(p => p.id === id);
    }
};
