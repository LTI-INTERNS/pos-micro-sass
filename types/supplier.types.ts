export type SupplierType = "Individual" | "Company";

export interface Supplier {
  id: string;
  type: SupplierType;
  name: string;
  companyName?: string;
  address: string;
  phone: string;
  email: string;
  coverarea: string;
  regNo: string;
  branches: string[];
  branchIds: string[];
  createdAt?: string;
}

export interface CreateSupplierInput {
  type: "INDIVIDUAL" | "COMPANY";
  name: string;
  phone: string;
  email: string;
  coverArea: string;
  address?: string;
  regNo?: string;
  companyName?: string;
  branchIds?: string[];
}

export type UpdateSupplierInput = Partial<CreateSupplierInput>;