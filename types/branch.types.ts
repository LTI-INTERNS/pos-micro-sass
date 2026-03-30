export interface Branch {
    id: string;
    city: string;
    name: string;
    phone: string;
    address: string;
    regno: number;
    email: string;
    password?: string;
}

export type CreateBranchInput = Omit<Branch, 'id'>;
export type UpdateBranchInput = Partial<CreateBranchInput>;
