import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

type BranchSessionContext = {
  branchId: string;
  branchName?: string;
  companyId: string;
  companyName?: string;
  createdAt?: number;
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
      branchName: parsed.branchName,
      companyId: parsed.companyId,
      companyName: parsed.companyName,
      createdAt: parsed.createdAt,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
};

const branchSessionExpired = (ctx: BranchSessionContext): boolean => {
  return typeof ctx.expiresAt === "number" && Date.now() >= ctx.expiresAt;
};

const branchSessionRequiredResponse = (message: string): NextResponse => {
  const res = NextResponse.json(
    {
      success: false,
      error: message,
      code: "BRANCH_SESSION_REQUIRED",
    },
    { status: 401 },
  );

  return clearBranchSessionCookies(res);
};

/**
 * POST /api/auth/verify-pin
 * Body: { cashierId, pin }
 *
 * This route intentionally uses the long-lived branch session cookie, not the
 * current NextAuth cashier session. Locking the POS destroys only the cashier
 * session; the branch session remains valid until its 8-hour expiry.
 */
export async function POST(req: NextRequest) {
  try {
    const branchToken = req.cookies.get("branch_session_token")?.value;
    const branchCtx = parseBranchSessionContext(
      req.cookies.get("branch_session_ctx")?.value,
    );

    if (!branchToken || !branchCtx) {
      return branchSessionRequiredResponse(
        "Branch session is not active. Please login to the branch again.",
      );
    }

    if (branchSessionExpired(branchCtx)) {
      return branchSessionRequiredResponse(
        "Branch session has expired. Please login to the branch again.",
      );
    }

    const body = (await req.json().catch(() => null)) as {
      cashierId?: string;
      pin?: string;
    } | null;

    const cashierId = body?.cashierId?.trim();
    const pin = body?.pin?.trim();

    if (!cashierId || !pin) {
      return NextResponse.json(
        {
          success: false,
          error: "cashierId and pin are required",
          code: "MISSING_FIELDS",
        },
        { status: 400 },
      );
    }

    if (!/^\d{4}$/.test(pin)) {
      return NextResponse.json(
        {
          success: false,
          error: "PIN must be exactly 4 digits",
          code: "INVALID_PIN",
        },
        { status: 400 },
      );
    }

    const res = await fetch(`${API}/api/v1/auth/cashier-pin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${branchToken}`,
      },
      body: JSON.stringify({ cashierId, pin }),
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
            "Invalid PIN",
          code: result?.error?.code ?? result?.code ?? "INVALID_PIN",
        },
        { status: res.status },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        code: "INTERNAL_SERVER_ERROR",
      },
      { status: 500 },
    );
  }
}
