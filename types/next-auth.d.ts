import 'next-auth';

declare module 'next-auth' {
    interface User {
        role:        string;  // OWNER | ADMIN | MANAGER | CASHIER | BRANCH_SESSION
        branchId:    string;
        branchName:  string;
        companyId:   string;
        companyName: string;
        token:       string;  // backend JWT — stored as backendToken in session
    }

    interface Session {
        user: {
            name?:        string | null;
            email?:       string | null;
            image?:       string | null;
            role:         string;
            branchId:     string;
            branchName:   string;
            companyId:    string;
            companyName:  string;
            backendToken: string;
        };
        error?: 'TokenExpired';  // propagated from jwt callback on expiry
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role:         string;
        branchId:     string;
        branchName:   string;
        companyId:    string;
        companyName:  string;
        backendToken: string;
        tokenExpiry:  number;  // exp from backend JWT (Unix seconds)
        error?:       'TokenExpired';
    }
}