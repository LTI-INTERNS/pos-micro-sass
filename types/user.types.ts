export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    branchId?: string;
    branchName?: string;
    image?: string;
    companyId?: string;
}

export interface AuthState {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
}
