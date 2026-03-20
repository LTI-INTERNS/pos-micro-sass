import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token    = req.nextauth.token;
        const pathname = req.nextUrl.pathname;
        const role     = token?.role?.toUpperCase();

        // ── BRANCH_SESSION ──────────────────────────────────────────────────
        // A BRANCH_SESSION token is only valid to visit /switchuser.
        // It cannot access any protected page — the cashier must enter their PIN first.
        if (role === 'BRANCH_SESSION') {
            if (!pathname.startsWith('/switchuser') && !pathname.startsWith('/pinentry')) {
                return NextResponse.redirect(new URL('/switchuser', req.url));
            }
            return NextResponse.next();
        }

        // ── CASHIER — POS only ───────────────────────────────────────────────
        if (role === 'CASHIER' && !pathname.startsWith('/posdashboard')) {
            return NextResponse.redirect(new URL('/posdashboard', req.url));
        }

        // ── MANAGER / ADMIN / OWNER — admin dashboard only ───────────────────
        if (
            role !== 'CASHIER' &&
            role !== 'BRANCH_SESSION' &&
            pathname.startsWith('/posdashboard')
        ) {
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
        '/pinentry/:path*',
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