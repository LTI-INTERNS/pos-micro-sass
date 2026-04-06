import { NextRequest, NextResponse } from "next/server";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("branch_session_token")?.value;
    const rawCtx = req.cookies.get("branch_session_ctx")?.value;

    console.log("CASHIERS API DEBUG - token exists:", !!token);
    console.log("CASHIERS API DEBUG - rawCtx:", rawCtx);

    if (!token || !rawCtx) {
      console.log("CASHIERS API DEBUG - missing branch session");
      return NextResponse.json(
        { success: false, error: "Branch session not found" },
        { status: 401 }
      );
    }

    const ctx = JSON.parse(decodeURIComponent(rawCtx)) as {
      branchId: string;
    };

    console.log("CASHIERS API DEBUG - parsed ctx:", ctx);

    if (!ctx.branchId) {
      console.log("CASHIERS API DEBUG - invalid ctx, no branchId");
      return NextResponse.json(
        { success: false, error: "Invalid branch session context" },
        { status: 400 }
      );
    }

    const url = `${API}/api/v1/branches/${ctx.branchId}/cashiers`;
    console.log("CASHIERS API DEBUG - fetching:", url);

    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    console.log("CASHIERS API DEBUG - backend status:", res.status);
    console.log("CASHIERS API DEBUG - backend response:", result);

    if (!res.ok || !result.success) {
      console.log("CASHIERS API DEBUG - fetch failed");
      return NextResponse.json(
        {
          success: false,
          error: result.message ?? result.error ?? "Failed to load cashiers",
          debug: {
            status: res.status,
            branchId: ctx.branchId,
            apiUrl: url,
            backendResponse: result,
          },
        },
        { status: res.status }
      );
    }

    console.log("CASHIERS API DEBUG - success");
    return NextResponse.json({
      success: true,
      data: result.data,
      debug: {
        status: res.status,
        branchId: ctx.branchId,
        apiUrl: url,
      },
    });
  } catch (error) {
    console.error("CASHIERS API DEBUG - exception:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch cashiers",
        debug: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}