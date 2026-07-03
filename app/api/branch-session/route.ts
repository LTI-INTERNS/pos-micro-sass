import { NextRequest, NextResponse } from "next/server";

type BranchSessionBody = {
  branchId: string;
  branchName: string;
  companyId: string;
  companyName: string;
  backendToken: string;
};

type BranchSessionContext = {
  branchId: string;
  branchName: string;
  companyId: string;
  companyName: string;
  createdAt: number;
  expiresAt: number;
};

const COOKIE_MAX_AGE = 30; // 30 seconds
const BRANCH_SESSION_DURATION_MS = COOKIE_MAX_AGE * 1000;

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
  raw?: string,
): BranchSessionContext | null => {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(
      decodeURIComponent(raw),
    ) as Partial<BranchSessionContext>;

    if (!parsed.branchId || !parsed.companyId) return null;

    // Older cookies may not have createdAt/expiresAt. The browser cookie maxAge
    // still enforces 8 hours, but new sessions include explicit timestamps too.
    const createdAt =
      typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now();
    const expiresAt =
      typeof parsed.expiresAt === "number"
        ? parsed.expiresAt
        : createdAt + BRANCH_SESSION_DURATION_MS;

    return {
      branchId: parsed.branchId,
      branchName: parsed.branchName ?? "",
      companyId: parsed.companyId,
      companyName: parsed.companyName ?? "",
      createdAt,
      expiresAt,
    };
  } catch {
    return null;
  }
};

const isExpired = (ctx: BranchSessionContext): boolean => {
  return Date.now() >= ctx.expiresAt;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<BranchSessionBody>;

    if (
      !body.branchId ||
      !body.branchName ||
      !body.companyId ||
      !body.companyName ||
      !body.backendToken
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing branch session fields",
          debug: {
            branchId: body.branchId ?? null,
            branchName: body.branchName ?? null,
            companyId: body.companyId ?? null,
            companyName: body.companyName ?? null,
            backendToken: body.backendToken ? "[present]" : null,
          },
        },
        { status: 400 },
      );
    }

    const createdAt = Date.now();
    const expiresAt = createdAt + BRANCH_SESSION_DURATION_MS;

    const ctx: BranchSessionContext = {
      branchId: body.branchId,
      branchName: body.branchName,
      companyId: body.companyId,
      companyName: body.companyName,
      createdAt,
      expiresAt,
    };

    const res = NextResponse.json({
      success: true,
      data: {
        ...ctx,
        secondsRemaining: Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)),
      },
    });

    res.cookies.set({
      name: "branch_session_token",
      value: body.backendToken,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    res.cookies.set({
      name: "branch_session_ctx",
      value: encodeURIComponent(JSON.stringify(ctx)),
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });

    return res;
  } catch (error) {
    console.error("FAILED TO CREATE BRANCH SESSION:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create branch session",
        debug: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("branch_session_token")?.value;
    const rawCtx = req.cookies.get("branch_session_ctx")?.value;
    const ctx = parseBranchSessionContext(rawCtx);

    if (!token || !ctx) {
      const res = NextResponse.json(
        { success: false, error: "No active branch session" },
        { status: 401 },
      );
      return clearBranchSessionCookies(res);
    }

    if (isExpired(ctx)) {
      const res = NextResponse.json(
        { success: false, error: "Branch session expired" },
        { status: 401 },
      );
      return clearBranchSessionCookies(res);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...ctx,
        secondsRemaining: Math.max(0, Math.floor((ctx.expiresAt - Date.now()) / 1000)),
      },
    });
  } catch (error) {
    console.error("INVALID BRANCH SESSION:", error);

    const res = NextResponse.json(
      {
        success: false,
        error: "Invalid branch session",
        debug: error instanceof Error ? error.message : "Unknown parse error",
      },
      { status: 400 },
    );

    return clearBranchSessionCookies(res);
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  return clearBranchSessionCookies(res);
}
