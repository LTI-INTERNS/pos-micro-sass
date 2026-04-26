import { apiClient } from '@/lib/api-client';

// ── Types ─────────────────────────────────────────────────────────────────────

export type VariantApprovalInput = {
    sku: string;
    barcode?: string;
    imageUrl?: string;
    basePrice: string | number;
    sellingPrice: string | number;
    sellUnit: string;
    optionValues: { optionName: string; value: string }[];
};

export type OptionApprovalInput = {
    name: string;
    values: string[];
};

export type ProductApprovalSubmitPayload = {
    name: string;
    categoryId: string;
    brand?: string;
    description?: string;
    options: OptionApprovalInput[];
    variants: VariantApprovalInput[];
};

export type NotificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type ApiNotification = {
    notifId: string;
    companyId: string;
    branchId: string;
    managerId: string;
    type: 'PRODUCT_APPROVAL';
    status: NotificationStatus;
    productData: ProductApprovalSubmitPayload;
    rejectionReason?: string | null;
    reviewedBy?: string | null;
    reviewedAt?: string | null;
    reviewerName?: string | null;
    reviewerRole?: string | null;
    readByAdmin: boolean;
    readByManager: boolean;
    createdAt: string;
    updatedAt: string;
    branch: { name: string; city: string | null };
    manager: { name: string; email: string };
};

interface ApiResponse<T> {
    success: boolean;
    data: T;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const notificationService = {
    /** Manager: submit a new product for admin/owner approval */
    submit: (payload: ProductApprovalSubmitPayload): Promise<ApiNotification> =>
        apiClient
            .post<ApiResponse<ApiNotification>>('/notifications/product-approval', payload)
            .then(res => res.data.data),

    /** Admin/Owner: list all notifications for the company */
    getAll: (): Promise<ApiNotification[]> =>
        apiClient
            .get<ApiResponse<ApiNotification[]>>('/notifications')
            .then(res => res.data.data ?? []),

    /** Admin/Owner: unread notification count for the bell badge */
    getUnreadCount: (): Promise<number> =>
        apiClient
            .get<ApiResponse<{ count: number }>>('/notifications/unread-count')
            .then(res => res.data.data?.count ?? 0),

    /** Admin/Owner: approve a product approval request */
    approve: (notifId: string): Promise<ApiNotification> =>
        apiClient
            .patch<ApiResponse<ApiNotification>>(`/notifications/${notifId}/approve`)
            .then(res => res.data.data),

    /** Admin/Owner: reject a product approval request with a mandatory reason */
    reject: (notifId: string, reason: string): Promise<ApiNotification> =>
        apiClient
            .patch<ApiResponse<ApiNotification>>(`/notifications/${notifId}/reject`, { reason })
            .then(res => res.data.data),

    /** Admin/Owner: mark a notification as read */
    markRead: (notifId: string): Promise<ApiNotification> =>
        apiClient
            .patch<ApiResponse<ApiNotification>>(`/notifications/${notifId}/read`)
            .then(res => res.data.data),
};
