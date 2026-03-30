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

export type CreateCompanyResult =
    | { ok: true;  companyId: string; name: string; businessType: string }
    | { ok: false; message: string };


export async function createCompany(
    input: CreateCompanyInput,
): Promise<CreateCompanyResult> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.backendToken) {
        return { ok: false, message: "Not authenticated. Please sign in again." };
    }

    try {
        const res = await fetch(`${API}/api/v1/companies`, {
            method:  "POST",
            headers: {
                "Content-Type":  "application/json",
                "Authorization": `Bearer ${session.user.backendToken}`,
            },
            body: JSON.stringify(input),
        });

        const data = await res.json();

        if (!res.ok) {
            return { ok: false, message: data?.message ?? "Failed to create company." };
        }

        return {
            ok:           true,
            companyId:    data.data.companyId,
            name:         data.data.name,
            businessType: data.data.businessType,
        };

    } catch {
        return { ok: false, message: "Unable to reach the server. Please try again." };
    }
}