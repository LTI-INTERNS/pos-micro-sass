import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token    = req.nextauth.token;
        const pathname = req.nextUrl.pathname;
        const role     = token?.role?.toUpperCase();

        // Expired backend token — force back to login
        if (token?.error === 'TokenExpired') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Tenant identity must always be present on protected routes
        if (!token?.companyId) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // ── Company selection — OWNER and ADMIN only ─────────────────────────
        if (pathname.startsWith('/companySelection') && role !== 'OWNER' && role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/overview', req.url));
        }

        // ── BRANCH_SESSION ───────────────────────────────────────────────────
        // Only valid to visit /switchuser or /pinentry — must upgrade via PIN first
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

        // ── STAFF (OWNER / ADMIN / MANAGER) — cannot access POS ─────────────
        if (role !== 'CASHIER' && role !== 'BRANCH_SESSION' && pathname.startsWith('/posdashboard')) {
            return NextResponse.redirect(new URL('/overview', req.url));
        }

        // ── MANAGER — no branch management access ────────────────────────────
        if (role === 'MANAGER' && pathname.startsWith('/branchmanagement')) {
            return NextResponse.redirect(new URL('/overview', req.url));
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Token must exist and must not be expired
            authorized: ({ token }) => !!token && token.error !== 'TokenExpired',
        },
    }
);

export const config = {
    matcher: [
        '/companySelection/:path*',
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