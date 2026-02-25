import { apiClient } from '@/lib/api-client';
import { staffData } from '@/lib/mocks/staffmanagement/mockStaffData';
import { Staff, CreateStaffInput, UpdateStaffInput } from '@/types/staff.types';

export type { Staff, CreateStaffInput, UpdateStaffInput };

export const staffService = {
    getAll: (): Promise<Staff[]> =>
        apiClient.get<Staff[]>('/staff').then(res => res.data).catch(() => staffData),

    getById: (id: string): Promise<Staff> =>
        apiClient.get<Staff>(`/staff/${id}`).then(res => res.data),

    create: (data: CreateStaffInput): Promise<Staff> =>
        apiClient.post<Staff>('/staff', data).then(res => res.data),

    update: (id: string, data: UpdateStaffInput): Promise<Staff> =>
        apiClient.put<Staff>(`/staff/${id}`, data).then(res => res.data),

    delete: (id: string): Promise<void> =>
        apiClient.delete(`/staff/${id}`).then(res => res.data),
};
