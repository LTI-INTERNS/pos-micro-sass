import { apiClient } from '@/lib/api-client';
import { Branch, CreateBranchInput, UpdateBranchInput } from '@/types/branch.types';

export type { Branch, CreateBranchInput, UpdateBranchInput };

interface BackendBranch {
    branchId: string;
    name:     string;
    city?:    string;
    phone:    string;
    email:    string;
    address:  string;
    // Account for both property names just in case the backend maps it differently
    registrationNumber?: string; 
    regno?: string;
    createdAt: string;
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// Map Backend Object to Frontend UI State Object
const mapBranch = (b: BackendBranch): Branch => ({
    id:      b.branchId,
    name:    b.name,
    city:    b.city ?? '',
    phone:   b.phone,
    email:   b.email,
    address: b.address,
    // THE FIX: Take the string exactly as it is without trying to run Number() on it.
    regno:   b.registrationNumber || b.regno || '', 
    createdAt: b.createdAt,
});

export const branchService = {
    getAll: (): Promise<Branch[]> =>
        apiClient
            .get<ApiResponse<BackendBranch[]>>('/branches')
            .then(res => res.data.data.map(mapBranch)),

    getById: (id: string): Promise<Branch> =>
        apiClient
            .get<ApiResponse<BackendBranch>>(`/branches/${id}`)
            .then(res => mapBranch(res.data.data)),

    create: (data: CreateBranchInput | any): Promise<Branch> =>
        apiClient
            .post<ApiResponse<BackendBranch>>('/branches', data)
            .then(res => mapBranch(res.data.data)),

    update: (id: string, data: UpdateBranchInput | any): Promise<Branch> =>
        apiClient
            .put<ApiResponse<BackendBranch>>(`/branches/${id}`, data)
            .then(res => mapBranch(res.data.data)),

    delete: (id: string): Promise<void> =>
        apiClient
            .delete(`/branches/${id}`)
            .then(res => res.data),
};