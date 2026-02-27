import 'next-auth';

declare module 'next-auth' {
    interface User {
        role:          string;
        branchId:      string;
        branchName:    string;
        token:         string;
    }

    interface Session {
        user: {
            name?:         string | null;
            email?:        string | null;
            role:          string;
            branchId:      string;
            branchName:    string;
            backendToken:  string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role:          string;
        branchId:      string;
        branchName:    string;
        backendToken:  string;
    }
}