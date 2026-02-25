"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api-client";

type LoginResult =
  | { ok: true; message: string }
  | { ok: false; message: string; field?: "email" | "password" };

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email) return { ok: false, message: "Email is required", field: "email" };
  if (!password) return { ok: false, message: "Password is required", field: "password" };

  try {
    // In production, call backend API. Backend handles password hashing.
    const response = await apiClient.post('/auth/login', { email, password });
    const { token } = response.data;

    const cookieStore = await cookies();
    cookieStore.set("lt_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { ok: true, message: "Signed in successfully" };
  } catch (error: unknown) {
    let message = "Invalid credentials";
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return { ok: false, message, field: "password" };
  }
}