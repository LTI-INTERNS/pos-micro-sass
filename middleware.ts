import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

function hasBranchSession(req: NextRequest) {
  return Boolean(
    req.cookies.get("branch_session_token")?.value &&
    req.cookies.get("branch_session_ctx")?.value
  );
}

function isBranchOnlyPath(pathname: string) {
  return pathname.startsWith("/switchuser") || pathname.startsWith("/pinentry");
}

function isCashierOnlyPath(pathname: string) {
  return (
    pathname.startsWith("/posdashboard") ||
    pathname.startsWith("/customer-display")
  );
}

function isPublicAuthPath(pathname: string) {
  return (
    pathname.startsWith("/login") ||
    pathname.startsWith("/saaslogin") ||
    pathname.startsWith("/forgotpassword") ||
    pathname.startsWith("/resetpassword")
  );
}

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const role = typeof token?.role === "string" ? token.role.toUpperCase() : "";
  const branchSessionExists = hasBranchSession(req);

  // Expired NextAuth token
  if (token?.error === "TokenExpired") {
    if (branchSessionExists) {
      return NextResponse.redirect(new URL("/switchuser", req.url));
    }

    const dest = role === "OWNER" ? "/saaslogin" : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // No current NextAuth token, but branch session is still active
  if (!token && branchSessionExists) {
    if (isBranchOnlyPath(pathname)) {
      return NextResponse.next();
    }

    if (!isPublicAuthPath(pathname)) {
      return NextResponse.redirect(new URL("/switchuser", req.url));
    }

    return NextResponse.next();
  }

  // No auth at all
  if (!token) {
    const dest = pathname.startsWith("/companyselection") ? "/saaslogin" : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // companyselection — OWNER and ADMIN only
  if (pathname.startsWith("/companyselection")) {
    if (role !== "OWNER" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/overview", req.url));
    }
    return NextResponse.next();
  }

  // All protected routes except companyselection need a company
  if (!token.companyId) {
    const dest = role === "OWNER" ? "/saaslogin" : "/login";
    return NextResponse.redirect(new URL(dest, req.url));
  }

  // BRANCH_SESSION can only use switchuser/pinentry
  if (role === "BRANCH_SESSION") {
    if (!branchSessionExists) {
      const url = new URL("/login", req.url);
      url.searchParams.set("expired", "true");
      return NextResponse.redirect(url);
    }

    if (!isBranchOnlyPath(pathname)) {
      return NextResponse.redirect(new URL("/switchuser", req.url));
    }

    return NextResponse.next();
  }

  // CASHIER can access POS + customer display, and must also have a valid branch session
  if (role === "CASHIER") {
    if (!branchSessionExists) {
      const url = new URL("/login", req.url);
      url.searchParams.set("expired", "true");
      return NextResponse.redirect(url);
    }

    if (isBranchOnlyPath(pathname)) {
      return NextResponse.redirect(new URL("/posdashboard", req.url));
    }

    if (!isCashierOnlyPath(pathname)) {
      return NextResponse.redirect(new URL("/posdashboard", req.url));
    }

    return NextResponse.next();
  }

  // OWNER / ADMIN / MANAGER should not access switchuser/pinentry
  if (isBranchOnlyPath(pathname)) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // STAFF / admin-side users cannot access cashier-only pages
  if (isCashierOnlyPath(pathname)) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  // MANAGER cannot access branch management
  if (role === "MANAGER" && pathname.startsWith("/branchmanagement")) {
    return NextResponse.redirect(new URL("/overview", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/companyselection/:path*",
    "/overview/:path*",
    "/posdashboard/:path*",
    "/customer-display/:path*",
    "/switchuser/:path*",
    "/pinentry/:path*",
    "/staffmanagement/:path*",
    "/customermanagement/:path*",
    "/productmanagement/:path*",
    "/ordermanagement/:path*",
    "/cashiermanagement/:path*",
    "/expensesmanagement/:path*",
    "/profitcalculation/:path*",
    "/suppliermanagement/:path*",
    "/reports/:path*",
    "/aiprediction/:path*",
    "/branchmanagement/:path*",
    "/settings/:path*",
  ],
};