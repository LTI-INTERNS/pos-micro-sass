export type StaffRole = "ADMIN" | "MANAGER";

export interface Staff {
  id: string;
  entityId: string;
  role: StaffRole;
  position: "Admin" | "Manager";
  name: string;
  staffNo: string;
  scopeId: string;
  scopeName: string;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
}

export interface StaffScopeOption {
  id: string;
  name: string;
}

export interface StaffCreateOptions {
  managerBranches: StaffScopeOption[];
  adminCompanies: StaffScopeOption[];
}

export interface CreateStaffInput {
  role: StaffRole;
  companyId?: string;
  branchId?: string;
  name: string;
  staffNo: string;
  email: string;
  phone: string;
  password: string;
}

export interface UpdateStaffInput {
  name?: string;
  staffNo?: string;
  branchId?: string;
  email?: string;
  phone?: string;
  password?: string;
}