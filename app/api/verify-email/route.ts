import { NextResponse } from "next/server";

// DEV ONLY: token -> email
const tokenStore =
  globalThis.__verifyTokens ?? new Map<string, string>();
globalThis.__verifyTokens = tokenStore;

// DEV ONLY: email -> verified
const verifiedStore =
  globalThis.__verifiedEmails ?? new Map<string, boolean>();
globalThis.__verifiedEmails = verifiedStore;

export async function POST(req: Request) {
  const { token } = await req.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json(
      { ok: false, message: "Token is required" },
      { status: 400 }
    );
  }

  const email = tokenStore.get(token);

  if (!email) {
    return NextResponse.json(
      { ok: false, message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  // mark email as verified
  verifiedStore.set(email, true);

  // token is one-time use
  tokenStore.delete(token);

  return NextResponse.json({ ok: true, email });
}