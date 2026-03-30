import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

export const apiClient = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1',
});

apiClient.interceptors.request.use(async (config) => {
    const session = await getSession();

    // Token expired — redirect to the correct login page based on role
    if (session?.error === 'TokenExpired') {
        const role = session?.user?.role?.toUpperCase();
        await signOut({ callbackUrl: role === 'OWNER' ? '/saaslogin' : '/login' });
        return Promise.reject(new Error('Session expired'));
    }

    // Inject tenant identity from the verified session (never from localStorage)
    if (session?.user?.companyId) {
        config.headers['X-Company-ID'] = session.user.companyId;
    }

    if (session?.user?.backendToken) {
        config.headers['Authorization'] = `Bearer ${session.user.backendToken}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const code = error?.response?.data?.code;
        const status = error?.response?.status;


        if (status === 403 && code === 'NO_COMPANY_CONTEXT') {
            const session = await getSession();
            const role = session?.user?.role?.toUpperCase();
            if (role === 'OWNER' || role === 'ADMIN') {
                window.location.replace('/companyselection');
            } else {
                await signOut({ callbackUrl: '/login' });
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);