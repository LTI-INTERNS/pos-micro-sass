import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

export const apiClient = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1',
});

function isBackendErrorEnvelope(payload: unknown): payload is {
    success: boolean;
    message?: string;
    error?: {
        code?: string;
        message?: string;
        userMessage?: string;
    };
} {
    return Boolean(payload && typeof payload === 'object' && 'success' in payload);
}

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
    (response) => {
        const payload = response?.data;

        if (isBackendErrorEnvelope(payload) && payload.success === false) {
            const normalizedError = new Error(payload.message || 'Request failed');
            Object.assign(normalizedError, {
                response: {
                    ...response,
                    data: payload,
                },
            });
            return Promise.reject(normalizedError);
        }

        return response;
    },
    async (error) => {
        if (!error?.response) {
            const networkError = new Error('Network error. Please check your connection and try again.');
            Object.assign(networkError, { isNetworkError: true });
            return Promise.reject(networkError);
        }

        const code = error?.response?.data?.error?.code ?? error?.response?.data?.code;
        const status = error?.response?.status;

        if (status === 403 && code === 'NO_COMPANY_CONTEXT') {
            const session = await getSession();
            const role = session?.user?.role?.toUpperCase();

            if (role === 'OWNER') {
                window.location.replace('/companyselection');
            } else if (role === 'ADMIN') {
                if (session?.user?.companyId) {
                    await signOut({ callbackUrl: '/login?expired=true' });
                } else {
                    window.location.replace('/companyselection');
                }
            } else {
                await signOut({ callbackUrl: '/login' });
            }
            return Promise.reject(error);
        }

        return Promise.reject(error);
    },
);