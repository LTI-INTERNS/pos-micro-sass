import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type BranchSessionContext = {
  branchId: string;
  companyId: string;
  expiresAt?: number;
};

const clearBranchSessionCookies = (res: NextResponse): NextResponse => {
  res.cookies.set({
    name: "branch_session_token",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  res.cookies.set({
    name: "branch_session_ctx",
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return res;
};

const parseBranchSessionContext = (
  rawCtx?: string,
): BranchSessionContext | null => {
  if (!rawCtx) return null;

  try {
    const parsed = JSON.parse(
      decodeURIComponent(rawCtx),
    ) as Partial<BranchSessionContext>;

    if (!parsed.branchId || !parsed.companyId) return null;

    return {
      branchId: parsed.branchId,
      companyId: parsed.companyId,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
};

const branchSessionExpired = (ctx: BranchSessionContext): boolean => {
  return typeof ctx.expiresAt === "number" && Date.now() >= ctx.expiresAt;
};

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("branch_session_token")?.value;
    const ctx = parseBranchSessionContext(
      req.cookies.get("branch_session_ctx")?.value,
    );

    if (!token || !ctx) {
      const res = NextResponse.json(
        { success: false, error: "Branch session not found" },
        { status: 401 },
      );
      return clearBranchSessionCookies(res);
    }

    if (branchSessionExpired(ctx)) {
      const res = NextResponse.json(
        { success: false, error: "Branch session expired" },
        { status: 401 },
      );
      return clearBranchSessionCookies(res);
    }

    const res = await fetch(`${API}/api/v1/auth/branches/${ctx.branchId}/cashiers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok || !result.success) {
      return NextResponse.json(
        {
          success: false,
          error:
            result?.error?.userMessage ??
            result?.error?.message ??
            result?.message ??
            "Failed to load cashiers",
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error("FAILED TO FETCH BRANCH CASHIERS:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cashiers",
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
