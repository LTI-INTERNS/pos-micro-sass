// ── Enums (mirror Prisma schema) ──────────────────────────────────────────────

export type OrderStatus     = 'PENDING' | 'COMPLETED' | 'CANCELED';
export type PaymentType     = 'CASH' | 'CARD' | 'SPLIT';
export type PaymentStatus   = 'PENDING' | 'COMPLETE' | 'FAILED';
export type BasicPaymentMethod = 'CASH' | 'CARD';

// ── Sub-records ───────────────────────────────────────────────────────────────

export interface OrderItemRecord {
    orderItemId: string;
    variantId:   string;
    productName: string;
    variantName: string | null;
    sku:         string;
    quantity:    number;
    unitPrice:   number;
    total:       number;
}

export interface PaymentDetailRecord {
    paymentDetailsId: string;
    transactionId:    string | null;
    method:           BasicPaymentMethod;
    amount:           number;
    cashReceived:     number | null;
    changeToGive:     number | null;
}

export interface OrderPaymentRecord {
    paymentId:      string;
    paymentType:    PaymentType;
    paymentStatus:  PaymentStatus;
    createdAt:      string;
    paymentDetails: PaymentDetailRecord[];
}

export interface OrderCustomer {
    customerId: string;
    name:       string;
    email:      string | null;
}

export interface OrderBranch {
    branchId: string;
    name:     string;
}

export interface OrderCashier {
    cashierId:  string;
    cashierNo:  string;
    name:       string;
}

export interface OrderDiscount {
    discountId: string;
    title:      string;
    percentage: number;
}

// ── Backend raw response (shape returned by GET /sales & GET /sales/:id) ──────

export interface BackendOrder {
    orderId:        string;
    orderNumber:    string;
    orderStatus:    OrderStatus;
    subTotal:       number;
    discountAmount: number;
    tax:            number;
    serviceCharge:  number;
    totalAmount:    number;
    note:           string | null;
    createdAt:      string;
    completedAt:    string | null;
    branch:         OrderBranch;
    cashier:        OrderCashier;
    customer:       OrderCustomer | null;
    discount:       OrderDiscount | null;
    orderItems:     OrderItemRecord[];
    payments:       OrderPaymentRecord[];
}

// ── Frontend-normalised Order (consumed by page & components) ─────────────────

export interface OrderItem {
    name:  string;
    qty:   number;
    price: number;
    total: number;
}

export interface Order {
    id:          string
    orderNumber: string;

    dateTime:    string;
    branch:      string;
    cashier:     string;
    paymenttype: string;
    totalamount: number;
    status:      OrderStatus;

    customer:     string;
    items:        OrderItem[];
    note:         string | null;

    subTotal:      number;
    discountAmount: number;
    tax:           number;
    serviceCharge: number;

    cashReceived:  number | null;
    changeToGive:  number | null;
    payments:      OrderPaymentRecord[];
}

// ── Stats (returned by GET /sales/stats) ─────────────────────────────────────

export interface OrderStats {
    totalOrders:    { value: number; pctChange: number };
    totalRevenue:   { value: number; pctChange: number };
    completedOrders:{ value: number; pctChange: number };
    canceledOrders: { value: number; pctChange: number };
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface GetOrdersParams {
    branchId?:  string;
    startDate?: string;
    endDate?:   string;
    status?:    OrderStatus;
    page?:      number;
    limit?:     number;
}

// ── Mutation input types ──────────────────────────────────────────────────────

export interface CreateOrderItemInput {
    variantId: string;
    quantity:  number;

}

export interface CreatePaymentInput {
    method:        BasicPaymentMethod | 'SPLIT';
    amount:        number;
    cashReceived?: number;
    changeToGive?: number;
    transactionId?: string;
    cashAmount?:   number;
    cardAmount?:   number;
}

export interface CreateOrderInput {
    customerId?:    string;
    discountId?:    string;
    note?:          string;
    customerEmail?: string;
    items:          CreateOrderItemInput[];
    payment:        CreatePaymentInput;
}

export interface UpdateOrderInput {
    orderStatus?: OrderStatus;
    note?:        string;
}

export interface CancelOrderInput {
    reason?: string;
}