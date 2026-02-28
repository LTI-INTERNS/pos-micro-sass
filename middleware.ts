import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token    = req.nextauth.token;
        const pathname = req.nextUrl.pathname;
        const role     = token?.role?.toUpperCase();

        // CASHIER — can only access posdashboard
        if (role === 'CASHIER' && !pathname.startsWith('/posdashboard')) {
            return NextResponse.redirect(new URL('/posdashboard', req.url));
        }

        // MANAGER, ADMIN, OWNER — cannot access posdashboard
        if (role !== 'CASHIER' && pathname.startsWith('/posdashboard')) {
            return NextResponse.redirect(new URL('/overview', req.url));
        }

        // MANAGER — cannot access branchmanagement
        if (role === 'MANAGER' && pathname.startsWith('/branchmanagement')) {
            return NextResponse.redirect(new URL('/overview', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token, // must be logged in
        },
    }
);

export const config = {
    matcher: [
        '/overview/:path*',
        '/posdashboard/:path*',
        '/switchuser/:path*',
        '/staffmanagement/:path*',
        '/customermanagement/:path*',
        '/productmanagement/:path*',
        '/ordermanagement/:path*',
        '/cashiermanagement/:path*',
        '/expensesmanagement/:path*',
        '/profitcalculation/:path*',
        '/suppliermanagement/:path*',
        '/reports/:path*',
        '/aiprediction/:path*',
        '/branchmanagement/:path*',
        '/settings/:path*',
    ],
};