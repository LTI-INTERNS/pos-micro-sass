import { apiClient } from "@/lib/api-client";
import type {
  Staff,
  StaffCreateOptions,
  CreateStaffInput,
  UpdateStaffInput,
} from "@/types/staff.types";

export type { Staff, StaffCreateOptions, CreateStaffInput, UpdateStaffInput };

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type BackendStaff = {
  staffId: string;
  entityId: string;
  role: "ADMIN" | "MANAGER";
  position: "Admin" | "Manager";
  name: string;
  staffNo: string | null;
  scopeId: string | null;
  scopeName: string | null;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
};

function mapStaff(item: BackendStaff): Staff {
  return {
    id: item.staffId,
    entityId: item.entityId,
    role: item.role,
    position: item.position,
    name: item.name,
    staffNo: item.staffNo ?? "",
    scopeId: item.scopeId ?? "",
    scopeName: item.scopeName ?? "",
    email: item.email,
    phone: item.phone,
    activeStatus: item.activeStatus,
    createdAt: item.createdAt,
  };
}

export const staffService = {
  getAll: async (): Promise<Staff[]> => {
    const res = await apiClient.get<ApiResponse<BackendStaff[]>>("/staff");
    return res.data.data.map(mapStaff);
  },

  getById: async (id: string): Promise<Staff> => {
    const res = await apiClient.get<ApiResponse<BackendStaff>>(`/staff/${id}`);
    return mapStaff(res.data.data);
  },

  getCreateOptions: async (): Promise<StaffCreateOptions> => {
    const res = await apiClient.get<ApiResponse<StaffCreateOptions>>("/staff/options");
    return res.data.data;
  },

  create: async (data: CreateStaffInput): Promise<Staff> => {
    const res = await apiClient.post<ApiResponse<BackendStaff>>("/staff", data);
    return mapStaff(res.data.data);
  },

  update: async (id: string, data: UpdateStaffInput): Promise<Staff> => {
    const res = await apiClient.patch<ApiResponse<BackendStaff>>(`/staff/${id}`, data);
    return mapStaff(res.data.data);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/staff/${id}`);
  },
};