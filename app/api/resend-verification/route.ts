import { NextResponse } from "next/server";

// DEV ONLY: simple in-memory token store
// token -> email
const tokenStore =
  globalThis.__verifyTokens ?? new Map<string, string>();
globalThis.__verifyTokens = tokenStore;

// DEV ONLY: user verified store
// email -> verified
const verifiedStore =
  globalThis.__verifiedEmails ?? new Map<string, boolean>();
globalThis.__verifiedEmails = verifiedStore;

function makeToken(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json(
      { ok: false, message: "Email is required" },
      { status: 400 }
    );
  }

  // create token and save
  const token = makeToken();
  tokenStore.set(token, email);

  // DEV ONLY: log verification link
  const link = `http://localhost:3000/verify-email?token=${token}`;
  console.log("Verification link:", link);

  return NextResponse.json({
    ok: true,
    message: "Verification email sent",
    token, // dev only
  });
}