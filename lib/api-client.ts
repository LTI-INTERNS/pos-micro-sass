import axios from 'axios';

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || '/api',
});

apiClient.interceptors.request.use((config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') : null;
    if (companyId) config.headers['X-Company-ID'] = companyId;
    return config;
});
