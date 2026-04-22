import { apiClient } from '@/lib/api-client';
import type {
    Order,
    OrderItem,
    OrderStats,
    BackendOrder,
    GetOrdersParams,
    CreateOrderInput,
    UpdateOrderInput,
    CancelOrderInput,
    OrderPaymentRecord,
} from '@/types/order.types';

export type {
    Order,
    OrderItem,
    OrderStats,
    CreateOrderInput,
    UpdateOrderInput,
    CancelOrderInput,
};

// ── Backend success envelope ──────────────────────────────────────────────────

interface BackendResponse<T> {
    success: boolean;
    data:    T;
}

/** Shape returned by GET /sales — a paginated wrapper, not a plain array. */
interface PaginatedOrdersResponse {
    orders:     BackendOrder[];
    pagination: {
        total:      number;
        page:       number;
        limit:      number;
        totalPages: number;
    };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Derive a human-readable payment type label from the payments array. */
function derivePaymentType(payments: OrderPaymentRecord[]): string {
    if (!payments || payments.length === 0) return '—';
    const type = payments[0].paymentType;
    // Capitalise first letter only: 'CASH' → 'Cash'
    return type.charAt(0) + type.slice(1).toLowerCase();
}

/** Pull cash-received / change from the first payment detail record. */
function extractCashDetail(payments: OrderPaymentRecord[]) {
    const detail = payments?.[0]?.paymentDetails?.[0];
    return {
        cashReceived: detail?.cashReceived ?? null,
        changeToGive: detail?.changeToGive ?? null,
    };
}

// ── Mapper: BackendOrder → Order ──────────────────────────────────────────────

function mapOrder(raw: BackendOrder): Order {
    const { cashReceived, changeToGive } = extractCashDetail(raw.payments);

    const items: OrderItem[] = (raw.orderItems ?? []).map((item) => ({
        name:  item.variantName
                 ? `${item.productName} – ${item.variantName}`
                 : item.productName,
        qty:   Number(item.quantity)  || 0,
        price: Number(item.unitPrice) || 0,
        total: Number(item.total)     || 0,
    }));

    return {
        // identifiers
        id:          raw.orderId,
        orderNumber: raw.orderNumber,

        // display fields used by the table and filter logic
        dateTime:    raw.createdAt,
        branch:      raw.branch?.name       ?? '—',
        cashier:     raw.cashier?.name      ?? '—',
        paymenttype: derivePaymentType(raw.payments),
        totalamount: Number(raw.totalAmount) || 0,
        status:      raw.orderStatus,

        // detail fields used by OrderBillModal
        customer:    raw.customer?.name ?? 'Walk-in Customer',
        items:       items.length > 0 ? items : [],
        note:        raw.note,

        // financial breakdown — all coerced from Prisma Decimal strings
        subTotal:       Number(raw.subTotal)       || 0,
        discountAmount: Number(raw.discountAmount) || 0,
        tax:            Number(raw.tax)            || 0,
        serviceCharge:  Number(raw.serviceCharge)  || 0,

        // payment detail
        cashReceived:  cashReceived !== null ? Number(cashReceived) || 0 : null,
        changeToGive:  changeToGive !== null ? Number(changeToGive) || 0 : null,
        payments:      raw.payments ?? [],
    };
}

// ── Service ───────────────────────────────────────────────────────────────────

export const orderService = {

    /**
     * GET /api/v1/sales
     * Returns all orders visible to the authenticated user's company/branch.
     * Optional query params: branchId, startDate, endDate, status, page, limit.
     */
    getAll: (params?: GetOrdersParams): Promise<Order[]> =>
        apiClient
            .get<BackendResponse<PaginatedOrdersResponse>>('/sales', { params })
            .then(res => (res.data.data?.orders ?? []).map(mapOrder)),

    /**
     * GET /api/v1/sales/:orderId
     * Returns a single order with full detail (items + payments).
     */
    getById: (orderId: string): Promise<Order> =>
        apiClient
            .get<BackendResponse<BackendOrder>>(`/sales/${orderId}`)
            .then(res => mapOrder(res.data.data)),

    /**
     * GET /api/v1/sales/stats
     * Returns aggregated stats for the stat-card grid.
     * Pass branchId to scope to a single branch; omit for company-wide.
     */
    getStats: (branchId?: string): Promise<OrderStats> =>
        apiClient
            .get<BackendResponse<OrderStats>>('/sales/stats', {
                params: branchId ? { branchId } : undefined,
            })
            .then(res => res.data.data),

    /**
     * POST /api/v1/sales
     * Creates a new order (POS checkout flow).
     */
    create: (data: CreateOrderInput): Promise<Order> =>
        apiClient
            .post<BackendResponse<BackendOrder>>('/sales', data)
            .then(res => mapOrder(res.data.data)),

    /**
     * PATCH /api/v1/sales/:orderId
     * Updates mutable fields on an existing order (e.g. note, status).
     */
    update: (orderId: string, data: UpdateOrderInput): Promise<Order> =>
        apiClient
            .patch<BackendResponse<BackendOrder>>(`/sales/${orderId}`, data)
            .then(res => mapOrder(res.data.data)),

    /**
     * PATCH /api/v1/sales/:orderId/cancel
     * Cancels an order (sets status to CANCELED).
     */
    cancel: (orderId: string, data?: CancelOrderInput): Promise<Order> =>
        apiClient
            .patch<BackendResponse<BackendOrder>>(`/sales/${orderId}/cancel`, data ?? {})
            .then(res => mapOrder(res.data.data)),

    /**
     * DELETE /api/v1/sales/:orderId
     * Soft-deletes an order (sets deletedAt).
     */
    remove: (orderId: string): Promise<void> =>
        apiClient
            .delete(`/sales/${orderId}`)
            .then(() => undefined),
};