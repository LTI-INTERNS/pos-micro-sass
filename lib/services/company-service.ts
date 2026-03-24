import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';

export interface Company {
    companyId:    string;
    name:         string;
    businessType: string;
}

export const companyService = {
    /**
     * Fetches companies accessible to the current OWNER or ADMIN.
     * Auth headers are injected automatically by apiClient interceptor.
     */
    getMyCompanies: (): Promise<Company[]> =>
        apiClient
            .get<ApiResponse<Company[]>>('/auth/companies')
            .then(res => res.data.data),
};