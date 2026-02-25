import { apiClient } from '@/lib/api-client';
import { branchesData } from '@/lib/mocks/branchmanagement';
import { Branch, CreateBranchInput, UpdateBranchInput } from '@/types/branch.types';

export type { Branch, CreateBranchInput, UpdateBranchInput };

export const branchService = {
    getAll: (): Promise<Branch[]> =>
        apiClient.get<Branch[]>('/branches').then(res => res.data).catch(() => branchesData),

    getById: (id: string): Promise<Branch> =>
        apiClient.get<Branch>(`/branches/${id}`).then(res => res.data),

    create: (data: CreateBranchInput): Promise<Branch> =>
        apiClient.post<Branch>('/branches', data).then(res => res.data),

    update: (id: string, data: UpdateBranchInput): Promise<Branch> =>
        apiClient.put<Branch>(`/branches/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/branches/${id}`).then(res => res.data),
};
