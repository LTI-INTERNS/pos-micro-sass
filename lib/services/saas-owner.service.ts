import { apiClient } from '@/lib/api-client';
import type { SaasOwnerCompany, SaasOwnerBranch } from '@/types/saas-owner.types';
import type { SubscriptionType, BusinessTypeEnum } from '@/types/subscription.types';

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
  createdAt?: string;
}

interface BackendCompany {
  companyId: string;
  name: string;
  businessType: { type: string };
  address: string;
  email: string;
  contactNumber: string;
  registrationNumber?: string;
  logoUrl?: string;
  createdAt: string;
  subscription: { type: SubscriptionType };
  branches: BackendBranch[];
  activeStaff: number;
  _count?: { branches: number };
  status?: 'ACTIVE' | 'INACTIVE';
}

const mapBranch = (b: BackendBranch): SaasOwnerBranch => ({
  id: b.branchId,
  name: b.name,
  city: b.city ?? '',
  phone: b.phone,
  email: b.email,
  address: b.address,
  regno: b.registrationNumber ?? '',
  createdAt: b.createdAt,
});

const mapCompany = (c: BackendCompany): SaasOwnerCompany => ({
  id: c.companyId,
  name: c.name,
  businessType: (c.businessType?.type ?? '') as BusinessTypeEnum,
  address: c.address,
  email: c.email,
  phone: c.contactNumber,
  registrationNumber: c.registrationNumber,
  logoUrl: c.logoUrl,
  registeredAt: c.createdAt,
  subscription: c.subscription?.type ?? 'FREE',
  branchCount: c._count?.branches ?? c.branches?.length ?? 0,
  activeStaff: c.activeStaff ?? 0,
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