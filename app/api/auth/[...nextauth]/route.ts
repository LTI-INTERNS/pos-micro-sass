import NextAuth, { NextAuthOptions, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session } from 'next-auth';
import type { AdapterUser } from 'next-auth/adapters';
import { jwtDecode } from 'jwt-decode';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

interface BackendJwt {
    role:      string;
    companyId: string;
    branchId:  string;
    exp:       number;
    userId?:    string;
    cashierId?: string;
}

export const authOptions: NextAuthOptions = {
    providers: [

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

                if (!staffRes.ok && staffRes.status === 403 && staffData?.error?.code === 'UNVERIFIED_ACCOUNT') {
                    throw new Error('UNVERIFIED_ACCOUNT');
                }

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

 
        CredentialsProvider({
            id:   'saas-owner-login',
            name: 'SaaS Owner Login',
            credentials: {
                email:    { label: 'Email',    type: 'email'    },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res  = await fetch(`${API}/api/v1/saas-owner/auth/login`, {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body:    JSON.stringify({ email: credentials.email, password: credentials.password }),
                });
                const data = await res.json();

                if (!res.ok || !data.success || !data.data?.ok) return null;

                const u = data.data;
                return {
                    id:          u.token,
                    email:       u.email,
                    name:        u.name,
                    role:        'SAAS_OWNER',
                    branchId:    '',
                    branchName:  '',
                    companyId:   '',
                    companyName: '',
                    token:       u.token,
                };
            },
        }),

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
                    role:        'CASHIER',
                    branchId:    credentials.branchId,
                    branchName:  credentials.branchName,
                    companyId:   credentials.companyId,
                    companyName: credentials.companyName,
                    token:       credentials.token,
                    cashierId:   credentials.cashierId,
                };
            },
        }),

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
        async jwt({ token, user, trigger, session: sessionUpdate }: {
            token:    JWT;
            user:     AdapterUser | User;
            trigger?: string;
            session?: { companyId?: string; companyName?: string; backendToken?: string };
        }) {
            if (trigger === 'update' && sessionUpdate?.companyId) {
                token.companyId    = sessionUpdate.companyId;
                token.companyName  = sessionUpdate.companyName ?? token.companyName;
                token.backendToken = sessionUpdate.backendToken ?? token.backendToken;
                if (sessionUpdate.backendToken) {
                    try {
                        const decoded     = jwtDecode<BackendJwt>(sessionUpdate.backendToken);
                        token.tokenExpiry = decoded.exp;
                    } catch { /* keep existing expiry */ }
                }
                return token;
            }

            if (user) {
                token.role         = user.role;
                token.branchId     = user.branchId;
                token.branchName   = user.branchName;
                token.companyId    = user.companyId;
                token.companyName  = user.companyName;
                token.backendToken = user.token;

                if ((user as any).cashierId) {
                    token.cashierId = (user as any).cashierId;
                }

                try {
                    const decoded     = jwtDecode<BackendJwt>(user.token);
                    token.tokenExpiry = decoded.exp;
                    if (decoded.companyId) token.companyId = decoded.companyId;
                    if (decoded.branchId)  token.branchId  = decoded.branchId;
                    if (decoded.cashierId) token.cashierId = decoded.cashierId;
                    if (decoded.userId)    token.userId    = decoded.userId;
                } catch { /* keep values already set */ }

                return token;
            }

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
            session.user.userId       = token.userId;
            session.user.cashierId    = token.cashierId;

            if (token.error) session.error = token.error;

            return session;
        },
    },

    pages: {
        signIn: '/saaslogin',
    },

    session: {
        strategy: 'jwt',
        maxAge:   8 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };