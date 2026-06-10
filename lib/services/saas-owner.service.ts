import { apiClient } from '@/lib/api-client';
import type { SaasOwnerCompany, SaasOwnerBranch } from '@/types/saas-owner.types';
import type { SubscriptionType } from '@/types/subscription.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface BackendBranch {
  branchId: string;
  name: string;
  city?: string;
  phone: string;
  email: string;
  address: string;
  registrationNumber?: string;
  regno?: string;
  createdAt?: string;
}

interface BackendCompany {
  companyId: string;
  name: string;
  businessType: { name: string };
  address: string;
  email: string;
  contactNumber: string;
  registrationNumber?: string;
  logoUrl?: string;
  createdAt: string;
  subscription: { type: SubscriptionType };
  branches: BackendBranch[];
  _count?: { branches: number; staff: number };
  status?: 'ACTIVE' | 'INACTIVE';
}

const mapBranch = (b: BackendBranch): SaasOwnerBranch => ({
  id: b.branchId,
  name: b.name,
  city: b.city ?? '',
  phone: b.phone,
  email: b.email,
  address: b.address,
  regno: b.registrationNumber || b.regno || '',
  createdAt: b.createdAt,
});

const mapCompany = (c: BackendCompany): SaasOwnerCompany => ({
  id: c.companyId,
  name: c.name,
  businessType: c.businessType?.name as any,
  address: c.address,
  email: c.email,
  phone: c.contactNumber,
  registrationNumber: c.registrationNumber,
  logoUrl: c.logoUrl,
  registeredAt: c.createdAt,
  subscription: c.subscription?.type ?? 'FREE',
  branchCount: c._count?.branches ?? c.branches?.length ?? 0,
  activeStaff: c._count?.staff,
  status: c.status ?? 'ACTIVE',
  branches: (c.branches ?? []).map(mapBranch),
});

export const saasOwnerService = {
  getAllCompanies: (): Promise<SaasOwnerCompany[]> =>
    apiClient
      .get<ApiResponse<BackendCompany[]>>('/saas-owner/companies')
      .then((res) => res.data.data.map(mapCompany)),

  getCompanyById: (id: string): Promise<SaasOwnerCompany> =>
    apiClient
      .get<ApiResponse<BackendCompany>>(`/saas-owner/companies/${id}`)
      .then((res) => mapCompany(res.data.data)),
};
