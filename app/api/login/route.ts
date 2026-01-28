import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (password !== "123") {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (username === "admin") {
    return NextResponse.json({ ok: true, role: "admin" });
  }

  if (username === "cashier") {
    return NextResponse.json({ ok: true, role: "user" });
  }

  return NextResponse.json(
    { ok: false, message: "Invalid credentials" },
    { status: 401 }
  );
}
