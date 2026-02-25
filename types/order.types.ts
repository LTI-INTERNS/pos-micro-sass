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
