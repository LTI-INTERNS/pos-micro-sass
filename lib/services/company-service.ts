import { apiClient } from '@/lib/api-client';
import { ApiResponse } from '@/types/api.types';

// ============================================================================
// EXISTING INTERFACE & FUNCTIONS 
// ============================================================================
export interface Company {
    companyId:    string;
    name:         string;
    businessType: string;
}

// ============================================================================
// NEW INTERFACE (For the Settings Page)
// ============================================================================
export interface CompanyDetails {
  id?: string;
  name: string;
  regNo: string;
  email: string;
  phone: string;
  address: string;
  logoUrl?: string;
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


    // ========================================================================
    // NEW FUNCTIONS (For the Settings Page - Company Details Tab)
    // ========================================================================

    /**
     * Fetches the detailed profile of the currently active company.
     */
    getMyCompany: (): Promise<CompanyDetails> =>
      apiClient
        .get<ApiResponse<CompanyDetails>>('/companies/me')
        .then(res => res.data.data),

    /**
     * Updates the active company's settings (name, phone, address, etc.)
     */
    updateMyCompany: (data: Partial<CompanyDetails>): Promise<CompanyDetails> =>
      apiClient
        .put<ApiResponse<CompanyDetails>>('/companies/me', data)
        .then(res => res.data.data),
};