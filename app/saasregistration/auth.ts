"use server";

import crypto from "crypto";
import { cookies } from "next/headers";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type RegisterResult =
  | { ok: true; message: string }
  | { ok: false; message: string; field?: keyof RegisterInput | "confirmPassword" };

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

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name) return { ok: false, message: "Name is required", field: "name" };
  if (!email) return { ok: false, message: "Email is required", field: "email" };
  if (!emailRegex.test(email))
    return { ok: false, message: "Enter a valid email", field: "email" };

  if (!password) return { ok: false, message: "Password is required", field: "password" };
  if (password.length < 6)
    return { ok: false, message: "Password must be at least 6 characters", field: "password" };

  if (!confirmPassword)
    return { ok: false, message: "Confirm password is required", field: "confirmPassword" };
  if (confirmPassword !== password)
    return { ok: false, message: "Passwords do not match", field: "confirmPassword" };

  if (usersStore.has(email)) {
    return { ok: false, message: "An account with this email already exists", field: "email" };
  }

  usersStore.set(email, {
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: Date.now(),
  });

  const cookieStore = await cookies();
  cookieStore.set("lt_session", Buffer.from(email).toString("base64"), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });

  return { ok: true, message: "Account created successfully" };
}