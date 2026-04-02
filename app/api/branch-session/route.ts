import { NextRequest, NextResponse } from "next/server";

type BranchSessionBody = {
  branchId: string;
  branchName: string;
  companyId: string;
  companyName: string;
  backendToken: string;
};

const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours
// const COOKIE_MAX_AGE = 30; // 30 seconds

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<BranchSessionBody>;

    console.log("BRANCH SESSION POST BODY:", body);

    if (
      !body.branchId ||
      !body.branchName ||
      !body.companyId ||
      !body.companyName ||
      !body.backendToken
    ) {
      console.error("MISSING BRANCH SESSION FIELDS:", {
        branchId: body.branchId,
        branchName: body.branchName,
        companyId: body.companyId,
        companyName: body.companyName,
        backendToken: body.backendToken ? "[present]" : "[missing]",
      });

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
        { status: 400 }
      );
    }

    const ctx = {
      branchId: body.branchId,
      branchName: body.branchName,
      companyId: body.companyId,
      companyName: body.companyName,
    };

    console.log("BRANCH SESSION CTX:", ctx);

    const res = NextResponse.json({
      success: true,
      debug: {
        message: "Branch session created",
        ctx,
        hasBackendToken: !!body.backendToken,
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

    console.log("BRANCH SESSION COOKIES SET:", {
      tokenCookie: "branch_session_token",
      ctxCookie: "branch_session_ctx",
    });

    return res;
  } catch (error) {
    console.error("FAILED TO CREATE BRANCH SESSION:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create branch session",
        debug:
          error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const raw = req.cookies.get("branch_session_ctx")?.value;

    console.log("BRANCH SESSION GET RAW COOKIE:", raw);

    if (!raw) {
      return NextResponse.json(
        { success: false, error: "No branch session" },
        { status: 401 }
      );
    }

    const ctx = JSON.parse(decodeURIComponent(raw));

    console.log("BRANCH SESSION GET PARSED CTX:", ctx);

    return NextResponse.json({ success: true, data: ctx });
  } catch (error) {
    console.error("INVALID BRANCH SESSION:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Invalid branch session",
        debug: error instanceof Error ? error.message : "Unknown parse error",
      },
      { status: 400 }
    );
  }
}

export async function DELETE() {
  console.log("DELETING BRANCH SESSION COOKIES");

  const res = NextResponse.json({ success: true });

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
}