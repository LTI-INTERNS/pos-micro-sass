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
    registrationNumber?: string; 
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
    // Safely convert the incoming string to a number to satisfy the frontend type
    regno:   b.registrationNumber ? Number(b.registrationNumber) : 0, 
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