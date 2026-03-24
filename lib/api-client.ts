import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

export const apiClient = axios.create({
    baseURL: (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api/v1',
});

apiClient.interceptors.request.use(async (config) => {
    const session = await getSession();

    // Token expired — force sign-out so the user is redirected to /login
    if (session?.error === 'TokenExpired') {
        await signOut({ callbackUrl: '/login' });
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