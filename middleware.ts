export { default } from 'next-auth/middleware';

export const config = {
    matcher: ['/overview/:path*', '/posdashboard/:path*', '/switchuser/:path*'],
};