import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface BackendJwt {
    role:      string;
    companyId: string;
    branchId:  string;
    exp:       number;
}

const handler = NextAuth({
    providers: [
        /**
         * Unified credentials provider — used by the /login page.
         *
         * Flow:
         *  1. Try staff login  (OWNER / ADMIN / MANAGER personal email + password)
         *  2. If that fails, try branch login (branch email + password)
         *  3. Encode the result type in `role` so the login form can route:
         *       BRANCH_SESSION      → /switchuser  (cashier picks their avatar)
         *       OWNER / ADMIN       → /companySelection
         *       MANAGER             → /overview
         */
        CredentialsProvider({
            id:   'credentials',
            name: 'Credentials',
            credentials: {
                email:    { label: 'Email',    type: 'email'    },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const body    = JSON.stringify({ email: credentials.email, password: credentials.password });
                const headers = { 'Content-Type': 'application/json' };

                // ── Step 1: try staff login ──────────────────────────────────
                const staffRes  = await fetch(`${API}/api/v1/auth/login`, { method: 'POST', headers, body });
                const staffData = await staffRes.json();

                if (staffRes.ok && staffData.success && staffData.data?.ok) {
                    const u = staffData.data;
                    return {
                        id:          u.token,
                        email:       u.email,
                        name:        u.name,
                        role:        u.role,
                        branchId:    u.branchId,
                        branchName:  u.branchName,
                        companyId:   u.companyId,
                        companyName: u.companyName,
                        token:       u.token,
                    };
                }

                // ── Step 2: try branch login ─────────────────────────────────
                const branchRes  = await fetch(`${API}/api/v1/auth/branch-login`, { method: 'POST', headers, body });
                const branchData = await branchRes.json();

                if (branchRes.ok && branchData.success && branchData.data?.ok) {
                    const b = branchData.data;
                    return {
                        id:          b.branchId,
                        email:       credentials.email,
                        name:        b.branchName,
                        role:        'BRANCH_SESSION',
                        branchId:    b.branchId,
                        branchName:  b.branchName,
                        companyId:   b.companyId,
                        companyName: b.companyName,
                        token:       b.token,
                    };
                }

                return null;
            },
        }),

        /**
         * Cashier PIN provider — called after verify-pin confirms the PIN server-side.
         * Creates the full CASHIER session that unlocks /posdashboard.
         */
        CredentialsProvider({
            id:   'cashier-pin',
            name: 'Cashier PIN',
            credentials: {
                cashierId:   { label: 'Cashier ID',    type: 'text' },
                name:        { label: 'Name',           type: 'text' },
                role:        { label: 'Role',           type: 'text' },
                branchId:    { label: 'Branch ID',      type: 'text' },
                branchName:  { label: 'Branch Name',    type: 'text' },
                companyId:   { label: 'Company ID',     type: 'text' },
                companyName: { label: 'Company Name',   type: 'text' },
                token:       { label: 'Backend Token',  type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.cashierId || !credentials?.token) return null;
                return {
                    id:          credentials.cashierId,
                    email:       '',
                    name:        credentials.name,
                    role:        credentials.role,
                    branchId:    credentials.branchId,
                    branchName:  credentials.branchName,
                    companyId:   credentials.companyId,
                    companyName: credentials.companyName,
                    token:       credentials.token,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            // First sign-in — map from authorize() return value
            if (user) {
                token.role         = user.role;
                token.branchId     = user.branchId;
                token.branchName   = user.branchName;
                token.companyId    = user.companyId;
                token.companyName  = user.companyName;
                token.backendToken = user.token;

                // Decode expiry from the backend JWT immediately on first sign-in
                try {
                    const decoded    = jwtDecode<BackendJwt>(user.token);
                    token.tokenExpiry = decoded.exp;
                    // Use companyId from the signed JWT as the authoritative source
                    token.companyId  = decoded.companyId || user.companyId;
                    token.branchId   = decoded.branchId  || user.branchId;
                } catch {
                    // jwtDecode failed — keep values from authorize()
                }

                return token;
            }

            // Subsequent requests — check if backend token has expired
            if (token.tokenExpiry && Date.now() / 1000 > token.tokenExpiry) {
                return { ...token, error: 'TokenExpired' as const };
            }

            return token;
        },

        async session({ session, token }) {
            session.user.role         = token.role;
            session.user.branchId     = token.branchId;
            session.user.branchName   = token.branchName;
            session.user.companyId    = token.companyId;
            session.user.companyName  = token.companyName;
            session.user.backendToken = token.backendToken;

            // Surface token expiry error to the client
            if (token.error) session.error = token.error;

            return session;
        },
    },

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
        maxAge:   8 * 60 * 60,  // 8 hours — matches backend JWT expiry
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };