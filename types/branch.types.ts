export interface Branch {
    id: string;
    name: string;
    city: string;
    phone: string;
    email: string;
    address: string;
    regno: string;
    password?: string;
    createdAt?: string;
    deletedAt?: string | null;
}

export interface CreateBranchInput {
    name: string;
    city: string;
    phone: string;
    email: string;
    address: string;
    registrationNumber?: string;
    password?: string;
}

export interface UpdateBranchInput extends Partial<CreateBranchInput> {}
