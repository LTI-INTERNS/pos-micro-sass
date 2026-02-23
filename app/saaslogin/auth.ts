"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

type LoginResult =
  | { ok: true; message: string }
  | { ok: false; message: string; field?: "email" | "password" };

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

type UserRecord = { name: string; email: string; passwordHash: string; createdAt: number };

declare global {
  // eslint-disable-next-line no-var
  var __LT_USERS_STORE: Map<string, UserRecord> | undefined;
}

const usersStore: Map<string, UserRecord> =
  globalThis.__LT_USERS_STORE ?? new Map<string, UserRecord>();
globalThis.__LT_USERS_STORE = usersStore;

function hashPassword(password: string) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email) return { ok: false, message: "Email is required", field: "email" };
  if (!emailRegex.test(email)) return { ok: false, message: "Enter a valid email", field: "email" };

  if (!password) return { ok: false, message: "Password is required", field: "password" };
  if (password.length < 6)
    return { ok: false, message: "Password must be at least 6 characters", field: "password" };

  const user = usersStore.get(email);
  if (!user) return { ok: false, message: "Account not found", field: "email" };

  const incomingHash = hashPassword(password);
  if (incomingHash !== user.passwordHash) {
    return { ok: false, message: "Invalid password", field: "password" };
  }

  const cookieStore = await cookies();
  cookieStore.set("lt_session", Buffer.from(email).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return { ok: true, message: "Signed in successfully" };
}