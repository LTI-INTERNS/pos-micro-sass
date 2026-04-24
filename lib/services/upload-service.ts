import { apiClient } from '@/lib/api-client';

export type UploadFolder = 'products' | 'cashiers' | 'companies' | 'pos';

export interface UploadResult {
    url:      string;
    publicId: string;
}

interface BackendResponse<T> {
    success: boolean;
    data:    T;
}

export const uploadService = {
    upload: async (file: File, folder: UploadFolder = 'products'): Promise<UploadResult> => {
        const form = new FormData();
        form.append('image', file);
        form.append('folder', folder);

        const res = await apiClient.post<BackendResponse<UploadResult>>('/upload', form);

        return res.data.data;
    },
};