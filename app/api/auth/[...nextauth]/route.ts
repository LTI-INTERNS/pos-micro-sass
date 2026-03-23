import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const handler = NextAuth({
    providers: [
        /**
         * Unified credentials provider — used by the single /login page.
         *
         * Flow:
         *  1. Try staff login (OWNER / ADMIN / MANAGER personal email + password)
         *  2. If that fails, try branch login (branch email + password)
         *  3. Encode the result type in the `role` field so LoginForm can route:
         *       BRANCH_SESSION  → /switchuser  (cashier picks their avatar)
         *       OWNER/ADMIN/MANAGER → /overview
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

                const body = JSON.stringify({
                    email:    credentials.email,
                    password: credentials.password,
                });
                const headers = { 'Content-Type': 'application/json' };

                // ── Step 1: try staff login ──────────────────────────────────
                const staffRes = await fetch(`${API}/api/v1/auth/login`, {
                    method: 'POST', headers, body,
                });
                const staffData = await staffRes.json();

                if (staffRes.ok && staffData.success && staffData.data?.ok) {
                    const u = staffData.data;
                    return {
                        id:               u.token,
                        email:            u.email,
                        name:             u.name,
                        role:             u.role,           // OWNER | ADMIN | MANAGER
                        branchId:         u.branchId,
                        branchName:       u.branchName,
                        organizationId:   u.companyId,
                        organizationName: u.companyName,
                        token:            u.token,
                    };
                }

                // ── Step 2: try branch login ─────────────────────────────────
                const branchRes = await fetch(`${API}/api/v1/auth/branch-login`, {
                    method: 'POST', headers, body,
                });
                const branchData = await branchRes.json();

                if (branchRes.ok && branchData.success && branchData.data?.ok) {
                    const b = branchData.data;
                    return {
                        id:               b.branchId,
                        email:            credentials.email,
                        name:             b.branchName,
                        role:             'BRANCH_SESSION', // signals LoginForm to go to /switchuser
                        branchId:         b.branchId,
                        branchName:       b.branchName,
                        organizationId:   b.companyId,
                        organizationName: b.companyName,
                        token:            b.token,
                    };
                }

                // Both failed — wrong credentials
                return null;
            },
        }),

        /**
         * Cashier PIN provider — called by Pinentry after PIN is verified
         * server-side via /api/auth/verify-pin.
         * Creates the full CASHIER session that lets the user into /posdashboard.
         */
        CredentialsProvider({
            id:   'cashier-pin',
            name: 'Cashier PIN',
            credentials: {
                cashierId:   { label: 'Cashier ID',   type: 'text' },
                name:        { label: 'Name',          type: 'text' },
                role:        { label: 'Role',          type: 'text' },
                branchId:    { label: 'Branch ID',     type: 'text' },
                branchName:  { label: 'Branch Name',   type: 'text' },
                companyId:   { label: 'Company ID',    type: 'text' },
                companyName: { label: 'Company Name',  type: 'text' },
                token:       { label: 'Backend Token', type: 'text' },
            },
            async authorize(credentials) {
                if (!credentials?.cashierId || !credentials?.token) return null;
                return {
                    id:               credentials.cashierId,
                    email:            '',
                    name:             credentials.name,
                    role:             credentials.role,      // CASHIER
                    branchId:         credentials.branchId,
                    branchName:       credentials.branchName,
                    organizationId:   credentials.companyId,
                    organizationName: credentials.companyName,
                    token:            credentials.token,
                };
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role             = user.role;
                token.branchId         = user.branchId;
                token.branchName       = user.branchName;
                token.organizationId   = user.organizationId;
                token.organizationName = user.organizationName;
                token.backendToken     = user.token;
            }
            return token;
        },

        async session({ session, token }) {
            session.user.role             = token.role             as string;
            session.user.branchId         = token.branchId         as string;
            session.user.branchName       = token.branchName       as string;
            session.user.organizationId   = token.organizationId   as string;
            session.user.organizationName = token.organizationName as string;
            session.user.backendToken     = token.backendToken     as string;
            return session;
        },
    },

    pages: {
        signIn: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
