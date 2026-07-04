"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export interface CreateCompanyInput {
    companyName:   string;
    address:       string;
    contactNumber: string;
    email:         string;
    logoUrl:       string;
    businessTypeId: string;
    subId:          string;
}

export interface ValidateCompanyDetailsInput {
    companyName:   string;
    address:       string;
    contactNumber: string;
    email:         string;
}

export type CreateCompanyResult =
    | { ok: true;  companyId: string; name: string; businessType: string }
    | { ok: false; message: string; code?: string };

export type ValidateCompanyDetailsResult =
    | { ok: true }
    | { ok: false; message: string; code?: string };

function normalizePhoneForApi(phone: string): string {
    const compact = phone.trim().replace(/[\s().-]/g, "");
    return compact.startsWith("00") ? `+${compact.slice(2)}` : compact;
}

function readApiError(data: any, fallback: string): { message: string; code?: string } {
    return {
        message:
            data?.error?.userMessage ||
            data?.error?.message ||
            data?.message ||
            fallback,
        code: data?.error?.code || data?.code,
    };
}

async function getBackendToken(): Promise<string | null> {
    const session = await getServerSession(authOptions);
    return session?.user?.backendToken ?? null;
}

export async function validateCompanyDetails(
    input: ValidateCompanyDetailsInput,
): Promise<ValidateCompanyDetailsResult> {
    const token = await getBackendToken();

    if (!token) {
        return { ok: false, message: "Not authenticated. Please sign in again.", code: "UNAUTHENTICATED" };
    }

    try {
        const res = await fetch(`${API}/api/v1/companies/validate-details`, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...input,
                email: input.email.trim().toLowerCase(),
                contactNumber: normalizePhoneForApi(input.contactNumber),
            }),
            cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const { message, code } = readApiError(data, "Company details are not valid.");
            return { ok: false, message, code };
        }

        return { ok: true };
    } catch {
        return { ok: false, message: "Unable to reach the server. Please try again.", code: "NETWORK_ERROR" };
    }
}

export async function createCompany(
    input: CreateCompanyInput,
): Promise<CreateCompanyResult> {
    const token = await getBackendToken();

    if (!token) {
        return { ok: false, message: "Not authenticated. Please sign in again.", code: "UNAUTHENTICATED" };
    }

    try {
        const res = await fetch(`${API}/api/v1/companies`, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                ...input,
                email: input.email.trim().toLowerCase(),
                contactNumber: normalizePhoneForApi(input.contactNumber),
            }),
            cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
            const { message, code } = readApiError(data, "Failed to create company.");
            return { ok: false, message, code };
        }

        return {
            ok:           true,
            companyId:    data.data.companyId,
            name:         data.data.name,
            businessType: data.data.businessType,
        };

    } catch {
        return { ok: false, message: "Unable to reach the server. Please try again.", code: "NETWORK_ERROR" };
    }
}
