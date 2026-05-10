"use server";

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

type RegisterFields = "name" | "email" | "password" | "confirmPassword";

type RegisterResult =
    | { ok: true;  message: string }
    | { ok: false; message: string; field?: RegisterFields };

export async function registerAction(formData: FormData): Promise<RegisterResult> {
    const name            = String(formData.get("name")            ?? "").trim();
    const email           = String(formData.get("email")           ?? "").trim().toLowerCase();
    const password        = String(formData.get("password")        ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    // ── Client-side guards (also enforced on the backend) ─────────────────────
    if (!name)                        return { ok: false, message: "Name is required",             field: "name"            };
    if (!email)                       return { ok: false, message: "Email is required",            field: "email"           };
    if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Enter a valid email",         field: "email"           };
    if (!password)                    return { ok: false, message: "Password is required",         field: "password"        };
    if (password.length < 6)          return { ok: false, message: "Password must be at least 6 characters", field: "password" };
    if (confirmPassword !== password) return { ok: false, message: "Passwords do not match",       field: "confirmPassword" };

    // ── Call backend ──────────────────────────────────────────────────────────
    try {
        const res  = await fetch(`${API}/api/v1/auth/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            // Map backend error codes to field-level errors where possible
            if (data?.code === 'EMAIL_TAKEN') {
                return { ok: false, message: 'An account with this email already exists', field: 'email' };
            }
            return { ok: false, message: data?.message ?? 'Registration failed' };
        }

        return { ok: true, message: data.message ?? 'Account created successfully. Please sign in.' };

    } catch {
        return { ok: false, message: 'Unable to reach the server. Please try again.' };
    }
}