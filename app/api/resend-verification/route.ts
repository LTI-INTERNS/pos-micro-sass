import { NextResponse } from "next/server";

//  DEV ONLY: simple in-memory token store
// token -> email
const tokenStore = (globalThis as any).__verifyTokens ?? new Map<string, string>();
(globalThis as any).__verifyTokens = tokenStore;

//  DEV ONLY: user verified store
// email -> verified
const verifiedStore = (globalThis as any).__verifiedEmails ?? new Map<string, boolean>();
(globalThis as any).__verifiedEmails = verifiedStore;

function makeToken() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ ok: false, message: "Email is required" }, { status: 400 });
  }

  //  create token and save
  const token = makeToken();
  tokenStore.set(token, email);

  //  in real system: send email with link
  // For now: log link to terminal
  const link = `http://localhost:3000/verify-email?token=${token}`;
  console.log(" Verification link:", link);

  // Don't reveal too much in real apps, but OK for dev:
  return NextResponse.json({ ok: true, message: "Verification email sent", token });
}
