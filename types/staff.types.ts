export type StaffRole = "ADMIN" | "MANAGER";
export type StaffTab = "admins" | "managers";

export interface CompanyTag {
  companyId: string;
  name: string;
}

export interface AdminStaff {
  id: string;
  entityId: string;
  role: "ADMIN";
  position: "Admin";
  name: string;
  staffNo: string;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
  assignedCompanies: CompanyTag[];
}

export interface ManagerStaff {
  id: string;
  entityId: string;
  role: "MANAGER";
  position: "Manager";
  name: string;
  staffNo: string;
  email: string;
  phone: string;
  activeStatus: boolean;
  createdAt: string;
  companyId: string;
  companyName: string;
  branchId: string;
  branchName: string;
}

export interface StaffDirectory {
  admins: AdminStaff[];
  managers: ManagerStaff[];
}

export interface BranchOption {
  id: string;
  name: string;
  companyId: string;
  companyName: string;
}

export interface CompanyOption {
  id: string;
  name: string;
}

export interface ExistingAdminOption {
  id: string;
  name: string;
  email: string;
  staffNo: string;
  phone: string;
  assignedCompanies: CompanyTag[];
}

export interface StaffCreateOptions {
  managerBranches: BranchOption[];
  adminCompanies: CompanyOption[];
  existingAdmins: ExistingAdminOption[];
}

export type CreateStaffInput =
  | {
      role: "MANAGER";
      branchId: string;
      name: string;
      staffNo: string;
      email: string;
      phone: string;
      password: string;
    }
  | {
      role: "ADMIN";
      adminMode: "NEW";
      companyId: string;
      name: string;
      staffNo: string;
      email: string;
      phone: string;
      password: string;
    }
  | {
      role: "ADMIN";
      adminMode: "EXISTING";
      existingAdminId: string;
      companyIds: string[];
    };

export interface UpdateStaffInput {
  name?: string;
  staffNo?: string;
  email?: string;
  phone?: string;
  password?: string;
  addCompanyIds?: string[];
  removeCompanyIds?: string[];
}