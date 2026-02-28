import { apiClient } from '@/lib/api-client';

export const posService = {
    getProducts: () => apiClient.get('/api/v1/products').then(res => res.data),
    createOrder: (data: unknown) => apiClient.post('/api/v1/orders', data).then(res => res.data),
};
