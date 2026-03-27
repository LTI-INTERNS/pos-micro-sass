/*
export const authOptions = {
    providers: [],
    callbacks: {
        async session({ session, token }: { session: { user: { id?: string | null } }; token: { sub?: string } }) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
};
*/