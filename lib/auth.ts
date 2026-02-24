/* eslint-disable @typescript-eslint/no-explicit-any */
export const authOptions = {
    providers: [],
    callbacks: {
        async session({ session, token }: any) {
            session.user.id = token.sub;
            return session;
        },
    },
};
