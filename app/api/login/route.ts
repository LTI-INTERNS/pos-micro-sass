import { NextResponse } from "next/server";

type Role = "admin" | "cashier";

const USERS: Record<
  string,
  { password: string; role: Role; email: string; emailVerified: boolean }
> = {
  admin: {
    password: "123",
    role: "admin",
    email: "admin@coca.lk",
    emailVerified: true,
  },
  cashier: {
    password: "123",
    role: "cashier",
    email: "cashier@coca.lk",
    emailVerified: false, 
  },
};

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const user = USERS[username];

  //  invalid username or wrong password
  if (!user || user.password !== password) {
    return NextResponse.json(
      { ok: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  //  valid credentials, return role + verification status
  return NextResponse.json({
    ok: true,
    role: user.role,
    email: user.email,
    emailVerified: user.emailVerified,
  });
}
