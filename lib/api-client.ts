import axios from 'axios';
import { getSession } from 'next-auth/react';
import { useConfigStore } from '@/store/useConfigStore';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

apiClient.interceptors.request.use(async (config) => {
    if (typeof window !== 'undefined') {
        const session = await getSession();

        // Read branchId from NextAuth session first, fallback to Zustand/localStorage
        const tenantId =
            session?.user?.branchId ||
            useConfigStore.getState().tenantId ||
            localStorage.getItem('companyId');

        if (tenantId) config.headers['X-Company-ID'] = tenantId;

        // Attach JWT token from session
        if (session?.user?.backendToken) {
            config.headers['Authorization'] = `Bearer ${session.user.backendToken}`;
        }
    }
    return config;
});