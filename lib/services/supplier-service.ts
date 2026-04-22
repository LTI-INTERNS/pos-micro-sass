import { apiClient } from "@/lib/api-client";
import {
  Supplier,
  CreateSupplierInput,
  UpdateSupplierInput,
} from "@/types/supplier.types";

export type { Supplier, CreateSupplierInput, UpdateSupplierInput };

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface BackendSupplier {
  supplierId: string;
  type: "INDIVIDUAL" | "COMPANY";
  name: string;
  phone: string;
  email: string;
  coverArea: string;
  address: string | null;
  regNo: string | null;
  companyName: string | null;
  createdAt: string;
  supplierBranches?: Array<{
    branch: {
      branchId: string;
      name: string;
    };
  }>;
}

function mapSupplier(s: BackendSupplier): Supplier {
  return {
    id: s.supplierId,
    type: s.type === "COMPANY" ? "Company" : "Individual",
    name: s.name,
    companyName: s.companyName ?? "",
    address: s.address ?? "",
    phone: s.phone,
    email: s.email,
    coverarea: s.coverArea,
    regNo: s.regNo ?? "",
    branches: (s.supplierBranches ?? []).map((item) => item.branch.name),
    branchIds: (s.supplierBranches ?? []).map((item) => item.branch.branchId),
    createdAt: s.createdAt,
  };
}

export const supplierService = {
  getAll: (): Promise<Supplier[]> =>
    apiClient
      .get<ApiResponse<BackendSupplier[]>>("/suppliers")
      .then((res) => (res.data.data ?? []).map(mapSupplier)),

  // Fetch suppliers that are assigned to a specific branch.
  // Uses the existing /suppliers endpoint and filters client-side via branchIds.
  getByBranchId: (branchId: string): Promise<Supplier[]> =>
    apiClient
      .get<ApiResponse<BackendSupplier[]>>("/suppliers")
      .then((res) =>
        (res.data.data ?? [])
          .map(mapSupplier)
          .filter((s) => s.branchIds.includes(branchId))
      ),

  getById: (id: string): Promise<Supplier> =>
    apiClient
      .get<ApiResponse<BackendSupplier>>(`/suppliers/${id}`)
      .then((res) => mapSupplier(res.data.data)),

  create: (data: CreateSupplierInput): Promise<Supplier> =>
    apiClient
      .post<ApiResponse<BackendSupplier>>("/suppliers", data)
      .then((res) => mapSupplier(res.data.data)),

  update: (id: string, data: UpdateSupplierInput): Promise<Supplier> =>
    apiClient
      .patch<ApiResponse<BackendSupplier>>(`/suppliers/${id}`, data)
      .then((res) => mapSupplier(res.data.data)),

  delete: (id: string): Promise<void> =>
    apiClient.delete(`/suppliers/${id}`).then(() => undefined),
};