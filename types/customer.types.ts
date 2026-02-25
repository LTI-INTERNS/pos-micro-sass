export interface Customer {
    id: number;
    name: string;
    phone: string;
    promoCard?: string;
    points: number;
    email: string;
    outstanding: number;
}

export type CreateCustomerInput = Omit<Customer, 'id'>;
export type UpdateCustomerInput = Partial<CreateCustomerInput>;
