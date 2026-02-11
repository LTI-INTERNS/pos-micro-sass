import { NextResponse } from "next/server";

type Role = "admin" | "cashier" | "superadmin";

const USERS: Record<
  string,
  { password: string; role: Role; emailVerified: boolean }
> = {
  "superadmin@coca.lk": {
    password: "123",
    role: "superadmin",
    emailVerified: true,
  },
  "admin@coca.lk": {
    password: "123",
    role: "admin",
    emailVerified: false,
  },
  "cashier@coca.lk": {
    password: "123",
    role: "cashier",
    emailVerified: false,
  },
};

const verifiedStore =
  (globalThis as any).__verifiedEmails ?? new Map<string, boolean>();
(globalThis as any).__verifiedEmails = verifiedStore;

export async function POST(req: Request) {
  const { email, password } = await req.json(); 
  const user = USERS[email];              
  if (!user || user.password !== password) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    role: user.role,
    email,
    emailVerified: verifiedStore.get(email) ?? user.emailVerified,
  });
}
