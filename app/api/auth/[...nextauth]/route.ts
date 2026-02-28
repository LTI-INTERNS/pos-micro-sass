import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email:    { label: 'Email',    type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const res = await fetch(
                    process.env.NEXT_PUBLIC_API_URL + '/api/v1/auth/login',
                    {
                        method:  'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body:    JSON.stringify({
                            email:    credentials.email,
                            password: credentials.password,
                        }),
                    }
                );

                const data = await res.json();
                if (!res.ok || !data.ok) return null;

                return {
                    id:               data.token,
                    email:            data.email,
                    name:             data.name,
                    role:             data.role,
                    branchId:         data.branchId,
                    branchName:       data.branchName,
                    organizationId:   data.organizationId,
                    organizationName: data.organizationName,
                    token:            data.token,
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
            session.user.role             = token.role;
            session.user.branchId         = token.branchId;
            session.user.branchName       = token.branchName;
            session.user.organizationId   = token.organizationId;
            session.user.organizationName = token.organizationName;
            session.user.backendToken     = token.backendToken;
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