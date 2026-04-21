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

/** OrderItem shape expected by OrderBillModal */
export interface OrderItem {
    name:  string;
    qty:   number;
    price: number;
    total: number;
}

/** Top-level Order shape consumed by ordermanagement/page.tsx */
export interface Order {
    // identifiers
    id:          string;        // orderId
    orderNumber: string;

    // display fields (match page.tsx column keys)
    dateTime:    string;        // createdAt ISO string
    branch:      string;        // branch.name
    cashier:     string;        // cashier.name
    paymenttype: string;        // derived from payments[0].paymentType
    totalamount: number;        // totalAmount
    status:      OrderStatus;

    // detail fields (used by OrderBillModal)
    customer:     string;       // customer.name | 'Walk-in Customer'
    items:        OrderItem[];  // mapped from orderItems
    note:         string | null;

    // financial breakdown
    subTotal:      number;
    discountAmount: number;
    tax:           number;
    serviceCharge: number;

    // payment detail (for receipt rendering)
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
    startDate?: string;   // ISO date string
    endDate?:   string;
    status?:    OrderStatus;
    page?:      number;
    limit?:     number;
}

// ── Mutation input types ──────────────────────────────────────────────────────

export interface CreateOrderItemInput {
    variantId: string;
    quantity:  number;
    // unitPrice is intentionally omitted — the backend derives price from
    // BranchVariant.sellingPriceOverride / variant.sellingPrice to prevent tampering.
}

export interface CreatePaymentInput {
    method:        BasicPaymentMethod;
    // amount is sent for UI reference; the backend always uses its own computed totalAmount.
    amount:        number;
    cashReceived?: number;
    changeToGive?: number;
    transactionId?: string;
    // paymentType is intentionally omitted — the backend derives it from method.
}

export interface CreateOrderInput {
    // branchId and cashierId are intentionally omitted — the backend reads
    // them from the verified JWT (req.user) and never trusts the request body.
    customerId?:    string;
    discountId?:    string;
    note?:          string;
    customerEmail?: string;   // walk-in email entered at POS confirmation screen
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