export interface Order {
    id: number;
    dateTime?: string;
    branch?: string;
    cashier?: string;
    paymenttype?: string;
    totalamount?: number;
    status?: string;
    action?: string;
}

export type CreateOrderInput = Omit<Order, 'id'>;
export type UpdateOrderInput = Partial<CreateOrderInput>;

// ─── POS-specific order payload ───────────────────────────────────────────
export interface PosOrderItem {
    productId: string;
    name: string;
    qty: number;
    unitPrice: number;
    subtotal: number;
}

export interface PosOrderPayload {
    orderNo: string;
    branchId: string | null;
    cashierName: string;
    customerId?: string | null;
    customerName?: string | null;
    customerPhone?: string | null;
    customerEmail?: string | null;
    items: PosOrderItem[];
    subtotal: number;
    discount: number;
    tax: number;
    tip: number;
    total: number;
    paymentMethod: string;
    amountPaid: number;
    change: number;
    receiptEmail?: string | null;
}

export interface PosOrderResponse {
    id: string;
    orderNo: string;
    status: string;
}
