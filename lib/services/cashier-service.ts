import { apiClient } from '@/lib/api-client';
import {
    Cashier,
    CashierResponse,
    CreateCashierInput,
    UpdateCashierInput,
} from '@/types/cashier.types';
import { ApiResponse } from '@/types/api.types';

export type { Cashier, CashierResponse, CreateCashierInput, UpdateCashierInput };

// ── Backend getAll response shape ─────────────────────────────────────────────
interface CashierListItem extends CashierResponse {
    phone: string;
    branch: {
        branchId: string;
        name:     string;
    };
}

// ── Mappers ───────────────────────────────────────────────────────────────────
function mapListItem(r: CashierListItem): Cashier {
    return {
        id:           r.cashierId,
        cashierNo:    r.cashierNo,
        name:         r.name,
        email:        r.email,
        phone:        r.phone,
        branchId:     r.branch.branchId,
        branchName:   r.branch.name,
        imgUrl:       r.imgUrl,
        activeStatus: r.activeStatus,
    };
}

function mapResponse(r: CashierResponse, branchId = '', branchName = ''): Cashier {
    return {
        id:           r.cashierId,
        cashierNo:    r.cashierNo,
        name:         r.name,
        email:        r.email,
        phone:        '',
        branchId,
        branchName,
        imgUrl:       r.imgUrl,
        activeStatus: r.activeStatus,
    };
}

// ── Service ───────────────────────────────────────────────────────────────────
export const cashierService = {

    /**
     * GET /api/v1/cashiers
     * Returns all cashiers for the authenticated user's company.
     */
    getAll: (): Promise<Cashier[]> =>
        apiClient
            .get<ApiResponse<CashierListItem[]>>('/cashiers')
            .then(res => res.data.data.map(mapListItem)),

    /**
     * GET /api/v1/cashiers/:cashierId
     */
    getById: (cashierId: string): Promise<Cashier> =>
        apiClient
            .get<ApiResponse<CashierListItem>>(`/cashiers/${cashierId}`)
            .then(res => mapListItem(res.data.data)),

    /**
     * POST /api/v1/cashiers
     */
    create: (data: CreateCashierInput): Promise<Cashier> =>
        apiClient
            .post<ApiResponse<CashierResponse>>('/cashiers', data)
            .then(res => mapResponse(res.data.data, data.branchId)),

    /**
     * PATCH /api/v1/cashiers/:cashierId
     */
    update: (cashierId: string, data: UpdateCashierInput): Promise<Cashier> =>
        apiClient
            .patch<ApiResponse<CashierResponse>>(`/cashiers/${cashierId}`, data)
            .then(res => mapResponse(res.data.data)),

    /**
     * PATCH /api/v1/cashiers/:cashierId/status — toggle active/inactive
     */
    toggleStatus: (cashierId: string, activeStatus: boolean): Promise<Cashier> =>
        apiClient
            .patch<ApiResponse<CashierResponse>>(`/cashiers/${cashierId}/status`, { activeStatus })
            .then(res => mapResponse(res.data.data)),

    /**
     * DELETE /api/v1/cashiers/:cashierId
     */
    remove: (cashierId: string): Promise<void> =>
        apiClient
            .delete(`/cashiers/${cashierId}`)
            .then(() => undefined),
};