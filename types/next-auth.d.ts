import 'next-auth';

declare module 'next-auth' {
    interface User {
        role:             string;
        branchId:         string;
        branchName:       string;
        organizationId:   string;
        organizationName: string;
        token:            string;   // backend JWT — mapped to backendToken in session
    }

    interface Session {
        user: {
            name?:            string | null;
            email?:           string | null;
            image?:           string | null;
            role:             string;
            branchId:         string;
            branchName:       string;
            organizationId:   string;
            organizationName: string;
            backendToken:     string;
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        role:             string;
        branchId:         string;
        branchName:       string;
        organizationId:   string;
        organizationName: string;
        backendToken:     string;
    }
}
