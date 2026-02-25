import { apiClient } from '@/lib/api-client';

export const posService = {
    getProducts: () => apiClient.get('/products').then(res => res.data),
    createOrder: (data: unknown) => apiClient.post('/orders', data).then(res => res.data),
};
