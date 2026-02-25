"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { apiClient } from "@/lib/api-client";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
};

type RegisterResult =
  | { ok: true; message: string }
  | { ok: false; message: string; field?: keyof RegisterInput | "confirmPassword" };

export async function registerAction(formData: FormData): Promise<RegisterResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!name) return { ok: false, message: "Name is required", field: "name" };
  if (!email) return { ok: false, message: "Email is required", field: "email" };
  if (!password) return { ok: false, message: "Password is required", field: "password" };
  if (confirmPassword !== password) return { ok: false, message: "Passwords do not match", field: "confirmPassword" };

  try {
    // In production, call backend API. Backend handles registration and hashing.
    const response = await apiClient.post('/auth/register', { name, email, password });
    const { token } = response.data;

    const cookieStore = await cookies();
    cookieStore.set("lt_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { ok: true, message: "Account created successfully" };
  } catch (error: unknown) {
    let message = "Registration failed";
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      message = error.response.data.message;
    }
    return { ok: false, message };
  }
}