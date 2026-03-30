import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, Account } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import { jwtDecode } from 'jwt-decode';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface BackendJwt {
    role:      string;
    companyId: string;
    branchId:  string;
    exp:       number;
}

export const authOptions: NextAuthOptions = {
    providers: [
        /**
         * Unified credentials provider — used by /login and /saaslogin.
         *
         * Flow:
         *  1. Try staff login  (OWNER / ADMIN / MANAGER personal email + password)
         *  2. If that fails, try branch login (branch email + password)
         *  3. Encode the result type in `role` so the login form can route:
         *       BRANCH_SESSION      → /switchuser        (cashier picks their avatar)
         *       OWNER               → /companySelection  (via saaslogin)
         *       ADMIN               → /companySelection or /overview
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
                        branchId:    u.branchId    ?? '',
                        branchName:  u.branchName  ?? '',
                        companyId:   u.companyId   ?? '',
                        companyName: u.companyName ?? '',
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

        /**
         * Company selection provider — called when OWNER or ADMIN picks a company
         * from the company selection page. Rewrites the JWT with the chosen companyId
         * so the middleware's companyId guard is satisfied on the next navigation.
         * All other session fields (role, backendToken, tokenExpiry, etc.) are
         * preserved by passing them through as credentials.
         */
        CredentialsProvider({
            id:   'select-company',
            name: 'Select Company',
            credentials: {
                companyId:    { label: 'Company ID',    type: 'text' },
                companyName:  { label: 'Company Name',  type: 'text' },
                role:         { label: 'Role',          type: 'text' },
                email:        { label: 'Email',         type: 'text' },
                name:         { label: 'Name',          type: 'text' },
                branchId:     { label: 'Branch ID',     type: 'text' },
                branchName:   { label: 'Branch Name',   type: 'text' },
                token:        { label: 'Backend Token', type: 'text' },
                tokenExpiry:  { label: 'Token Expiry',  type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.companyId || !credentials?.token) return null;
                return {
                    id:          credentials.companyId,
                    email:       credentials.email        ?? '',
                    name:        credentials.name         ?? '',
                    role:        credentials.role         ?? '',
                    branchId:    credentials.branchId     ?? '',
                    branchName:  credentials.branchName   ?? '',
                    companyId:   credentials.companyId,
                    companyName: credentials.companyName  ?? '',
                    token:       credentials.token,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }: { token: JWT; user: AdapterUser | User; account: Account | null }) {
            // First sign-in — map from authorize() return value
            if (user) {
                token.role         = user.role;
                token.branchId     = user.branchId;
                token.branchName   = user.branchName;
                token.companyId    = user.companyId;
                token.companyName  = user.companyName;
                token.backendToken = user.token;

                // select-company re-sign-in: the backend JWT hasn't changed, so
                // preserve the tokenExpiry already stored in the existing token
                // rather than re-decoding (which would reset the clock to now).
                if (account?.provider === 'select-company') {
                    // tokenExpiry is already on the incoming token — keep it.
                    return token;
                }

                // Decode expiry from the backend JWT immediately on first sign-in
                try {
                    const decoded     = jwtDecode<BackendJwt>(user.token);
                    token.tokenExpiry = decoded.exp;
                    // Only override companyId/branchId from JWT if they are non-empty
                    // OWNER has companyId '' until they select one — keep it as-is
                    if (decoded.companyId) token.companyId = decoded.companyId;
                    if (decoded.branchId)  token.branchId  = decoded.branchId;
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

        async session({ session, token }: { session: Session; token: JWT }) {
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
        // OWNER logs in via /saaslogin, staff via /login.
        // NextAuth uses this as the redirect target when auth fails.
        // We use /saaslogin as the default since OWNER is the one who
        // hits unauthenticated protected routes (/companySelection).
        signIn: '/saaslogin',
    },

    session: {
        strategy: 'jwt',
        maxAge:   8 * 60 * 60,  // 8 hours — matches backend JWT expiry
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };