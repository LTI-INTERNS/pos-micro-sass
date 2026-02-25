import axios from 'axios';
import { useConfigStore } from '@/store/useConfigStore';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

apiClient.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        // Dynamic tenant header from Zustand store
        const tenantId = useConfigStore.getState().tenantId || localStorage.getItem('companyId');
        if (tenantId) config.headers['X-Company-ID'] = tenantId;
    }
    return config;
});
