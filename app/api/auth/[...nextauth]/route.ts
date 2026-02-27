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

                // Call your Express backend
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`,
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

                // Whatever you return here gets stored in the token
                return {
                    id:         data.token,
                    email:      data.email,
                    name:       data.name,
                    role:       data.role,
                    branchId:   data.branchId,
                    branchName: data.branchName,
                    token:      data.token,
                };
            },
        }),
    ],

    callbacks: {
        // Runs when JWT is created/updated — put extra fields into the token
        async jwt({ token, user }) {
            if (user) {
                token.role       = user.role;
                token.branchId   = user.branchId;
                token.branchName = user.branchName;
                token.backendToken = user.token;
            }
            return token;
        },

        // Runs when session is accessed — expose fields to the frontend
        async session({ session, token }) {
            session.user.role        = token.role;
            session.user.branchId    = token.branchId;
            session.user.branchName  = token.branchName;
            session.user.backendToken = token.backendToken;
            return session;
        },
    },

    pages: {
        signIn: '/login', // redirect to your login page if not authenticated
    },

    session: {
        strategy: 'jwt', // stores session in cookie, no DB needed
    },

    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };