import { apiClient } from "@/lib/api-client";
import type {
  AdminStaff,
  BranchOption,
  CompanyOption,
  CompanyTag,
  CreateStaffInput,
  ExistingAdminOption,
  ManagerStaff,
  StaffCreateOptions,
  StaffDirectory,
  UpdateStaffInput,
} from "@/types/staff.types";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

type BackendAdmin = {
  id: string;
  entityId: string;
  role: "ADMIN";
  position: "Admin";
  name: string;
  staffNo: string | null;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
  assignedCompanies: CompanyTag[];
};

type BackendManager = {
  id: string;
  entityId: string;
  role: "MANAGER";
  position: "Manager";
  name: string;
  staffNo: string | null;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
};

function mapAdmin(item: BackendAdmin): AdminStaff {
  return {
    ...item,
    staffNo: item.staffNo ?? "",
  };
}

function mapManager(item: BackendManager): ManagerStaff {
  return {
    ...item,
    staffNo: item.staffNo ?? "",
  };
}

function mapOptions(data: {
  hasBranches: boolean;
  managerBranches: BranchOption[];
  adminCompanies: CompanyOption[];
  existingAdmins: Array<{
    id: string;
    name: string;
    email: string;
    staffNo: string | null;
    phone: string;
    assignedCompanies: CompanyTag[];
  }>;
}): StaffCreateOptions {
  return {
    hasBranches: data.hasBranches,
    // Filter out soft-deleted branches — the backend marks deleted branches
    // by appending "_del_<timestamp>" to their name.
    managerBranches: data.managerBranches.filter(
      (branch) => !branch.name.includes('_del_')
    ),
    adminCompanies: data.adminCompanies,
    existingAdmins: data.existingAdmins.map(
      (admin): ExistingAdminOption => ({
        ...admin,
        staffNo: admin.staffNo ?? "",
      })
    ),
  };
}

export const staffService = {
  getAll: async (): Promise<StaffDirectory> => {
    const res = await apiClient.get<
      ApiResponse<{ admins: BackendAdmin[]; managers: BackendManager[] }>
    >("/staff");

    return {
      admins: (res.data.data.admins ?? []).map(mapAdmin),
      managers: (res.data.data.managers ?? []).map(mapManager),
    };
  },

  getCreateOptions: async (): Promise<StaffCreateOptions> => {
    const res = await apiClient.get<
      ApiResponse<{
        hasBranches: boolean;
        managerBranches: BranchOption[];
        adminCompanies: CompanyOption[];
        existingAdmins: Array<{
          id: string;
          name: string;
          email: string;
          staffNo: string | null;
          phone: string;
          assignedCompanies: CompanyTag[];
        }>;
      }>
    >("/staff/options");

    return mapOptions(res.data.data);
  },

  create: async (data: CreateStaffInput): Promise<AdminStaff | ManagerStaff> => {
    const res = await apiClient.post<ApiResponse<BackendAdmin | BackendManager>>("/staff", data);
    return res.data.data.role === "ADMIN" ? mapAdmin(res.data.data) : mapManager(res.data.data);
  },

  update: async (staffId: string, data: UpdateStaffInput): Promise<AdminStaff | ManagerStaff> => {
    const res = await apiClient.patch<ApiResponse<BackendAdmin | BackendManager>>(
      `/staff/${staffId}`,
      data
    );
    return res.data.data.role === "ADMIN" ? mapAdmin(res.data.data) : mapManager(res.data.data);
  },

  remove: async (staffId: string): Promise<void> => {
    await apiClient.delete(`/staff/${staffId}`);
  },
};