import { NextResponse } from "next/server";

type Role = "admin" | "cashier" | "superadmin";

const USERS: Record<
  string,
  { password: string; role: Role; email: string; emailVerified: boolean }
> = {
  superadmin: {
    password: "123",
    role: "superadmin",
    email: "superadmin@coca.lk",
    emailVerified: true, 
  },
  admin: {
    password: "123",
    role: "admin",
    email: "admin@coca.lk",
    emailVerified: false, 
  },
  cashier: {
    password: "123",
    role: "cashier",
    email: "cashier@coca.lk",
    emailVerified: false, 
  },
};


// ADDED: shared verified status store (dev only)
const verifiedStore =
  (globalThis as any).__verifiedEmails ?? new Map<string, boolean>();
(globalThis as any).__verifiedEmails = verifiedStore;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = USERS[username];

  if (!user || user.password !== password) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({
    ok: true,
    role: user.role,
    email: user.email,
    emailVerified: verifiedStore.get(user.email) ?? user.emailVerified,
  });
}
