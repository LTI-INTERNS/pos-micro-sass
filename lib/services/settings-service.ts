import { apiClient } from '@/lib/api-client';

export type SystemSettings = {
  settingId?: string;
  branchId?: string;
  companyId?: string;
  cusDisplay: boolean;
  lowStock: boolean;
  negativeStock: boolean;
  weightBarcode: boolean;
  country: string;
  currency: string;
  useCents: boolean;
  loyalty: number;
  receiptHeader: string;
  receiptFooter: string;
  receiptLogo: boolean;
  tax: boolean;
  taxNumber?: string;
  customerDetails: boolean;
  posTheme: string;
  posImgUrl: string | null;
  posImgPublicId: string | null;
  productImage: boolean;
};

/**
 * Payload sent to PUT /api/v1/settings.
 * No branchId needed — the backend resolves it from the JWT:
 *   - Manager  → their own branch
 *   - Owner/Admin → all branches in the company
 * All fields are optional so the UI only sends what it manages.
 */
export type SaveSettingsPayload = Partial<Omit<SystemSettings, 'settingId' | 'branchId' | 'companyId'>>;

export const settingsService = {
  /**
   * Fetch the current settings.
   * - Manager: backend uses their session branchId automatically.
   * - Owner/Admin: backend returns the first (representative) branch record.
   */
  async get(): Promise<SystemSettings | null> {
    const res = await apiClient.get<{ success: boolean; data: SystemSettings | null }>('/settings');
    return res.data?.data ?? null;
  },

  /**
   * Save settings.
   * - Manager  → updates only their branch record.
   * - Owner/Admin → upserts ALL branch records in the company.
   * No branchId in the payload — backend handles routing by role.
   */
  async save(payload: SaveSettingsPayload): Promise<void> {
    await apiClient.put('/settings', payload);
  },
};
