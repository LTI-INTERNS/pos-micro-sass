import { NextResponse } from "next/server";

const tokenStore = (globalThis as any).__verifyTokens ?? new Map<string, string>();
(globalThis as any).__verifyTokens = tokenStore;

const verifiedStore = (globalThis as any).__verifiedEmails ?? new Map<string, boolean>();
(globalThis as any).__verifiedEmails = verifiedStore;

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ ok: false, message: "Token is required" }, { status: 400 });
  }

  const email = tokenStore.get(token);

  if (!email) {
    return NextResponse.json({ ok: false, message: "Invalid or expired token" }, { status: 400 });
  }

  //  mark verified
  verifiedStore.set(email, true);

  //  token should be one-time use
  tokenStore.delete(token);

  return NextResponse.json({ ok: true, email });
}
