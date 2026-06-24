import type { SubscriptionType, BusinessTypeEnum } from '@/types/subscription.types';

export interface SaasOwnerBranch {
  id: string;
  name: string;
  city: string;
  phone: string;
  email: string;
  address: string;
  regno: string;
  createdAt?: string;
}

export interface SaasOwnerCompany {
  id: string;
  name: string;
  businessType: BusinessTypeEnum;
  country?: string;
  city?: string;
  address: string;
  email: string;
  phone: string;
  registrationNumber?: string;
  logoUrl?: string;
  registeredAt: string;
  subscription: SubscriptionType;
  branchCount: number;
  activeStaff?: number;
  status: 'ACTIVE' | 'INACTIVE';
  branches: SaasOwnerBranch[];
}

export interface SaasOwnerSubscriptionSummary {
  type: SubscriptionType;
  companyCount: number;
  monthlyRevenue: number;
}
