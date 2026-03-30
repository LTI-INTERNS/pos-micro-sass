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
}

export const branchService = {
    getAll: (): Promise<Branch[]> =>
        apiClient
            .get<{ success: boolean; data: BackendBranch[] }>('/branches')
            .then(res =>
                res.data.data.map((b): Branch => ({
                    id:      b.branchId,
                    name:    b.name,
                    phone:   b.phone,
                    email:   b.email,
                    address: b.address,
                    regno:   0,
                }))
            ),

    getById: (id: string): Promise<Branch> =>
        apiClient.get<Branch>(`branches/${id}`).then(res => res.data),

    create: (data: CreateBranchInput): Promise<Branch> =>
        apiClient.post<Branch>('branches', data).then(res => res.data),

    update: (id: string, data: UpdateBranchInput): Promise<Branch> =>
        apiClient.put<Branch>(`branches/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`branches/${id}`).then(res => res.data),
};
