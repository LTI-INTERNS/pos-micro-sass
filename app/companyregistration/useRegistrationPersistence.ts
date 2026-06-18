
import { useCallback } from "react";
import { RegistrationData } from "@/app/companyregistration/page";

const DRAFT_KEY_PREFIX = "company_registration_draft_";
const STEP_KEY_PREFIX  = "company_registration_step_";

type PersistableData = Omit<RegistrationData, "logo">;

/** Build per-owner localStorage keys. Returns null if userId is missing. */
function getKeys(userId: string | null | undefined): { draftKey: string; stepKey: string } | null {
    if (!userId) return null;
    return {
        draftKey: `${DRAFT_KEY_PREFIX}${userId}`,
        stepKey:  `${STEP_KEY_PREFIX}${userId}`,
    };
}

export function saveRegistrationData(data: RegistrationData, step: number, userId: string | null | undefined): void {
    const keys = getKeys(userId);
    if (!keys) return; // No user identity — do not persist to prevent cross-owner leaks
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { logo, ...rest } = data;
        localStorage.setItem(keys.draftKey, JSON.stringify(rest satisfies PersistableData));
        localStorage.setItem(keys.stepKey, String(step));
    } catch {
        // quota exceeded or private-browsing mode — fail silently
    }
}

export function loadRegistrationData(userId: string | null | undefined): {
    data: Partial<RegistrationData> | null;
    step: number;
} {
    const keys = getKeys(userId);
    if (!keys) return { data: null, step: 1 }; // No user identity — return empty to prevent cross-owner leaks
    try {
        const raw     = localStorage.getItem(keys.draftKey);
        const rawStep = localStorage.getItem(keys.stepKey);
        if (!raw) return { data: null, step: 1 };

        const data = JSON.parse(raw) as PersistableData;
        const step = rawStep ? Math.max(1, parseInt(rawStep, 10)) : 1;
        return { data: { ...data, logo: null }, step };
    } catch {
        return { data: null, step: 1 };
    }
}

export function clearRegistrationData(userId: string | null | undefined): void {
    const keys = getKeys(userId);
    if (!keys) return;
    try {
        localStorage.removeItem(keys.draftKey);
        localStorage.removeItem(keys.stepKey);
    } catch { /* ignore */ }
}

export function useRegistrationPersistence(userId: string | null | undefined) {
    const save  = useCallback((data: RegistrationData, step: number) => saveRegistrationData(data, step, userId), [userId]);
    const load  = useCallback(() => loadRegistrationData(userId), [userId]);
    const clear = useCallback(() => clearRegistrationData(userId), [userId]);
    return { save, load, clear };
}