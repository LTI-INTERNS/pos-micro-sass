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
    // ... your existing fields
}

export interface UpdateBranchInput {
    // ... your existing fields
}
