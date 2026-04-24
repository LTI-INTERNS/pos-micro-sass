export interface Branch {
    id: string;
    name: string;
    city: string;
    phone: string;
    email: string;
    address: string;
    regno: string; // <-- Change this to string
    password?: string;
    createdAt?: string;
}

export interface CreateBranchInput {
    // ... your existing fields
}

export interface UpdateBranchInput {
    // ... your existing fields
}