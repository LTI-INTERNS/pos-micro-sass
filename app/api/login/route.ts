import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, password } = body;

  // TODO: replace with real validation (DB)
  if (username === "admin" && password === "123") {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
}
