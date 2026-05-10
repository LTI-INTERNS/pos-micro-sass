
import { useCallback } from "react";
import { RegistrationData } from "@/app/companyregistration/page";

const STORAGE_KEY = "company_registration_draft";
const STEP_KEY    = "company_registration_step";

type PersistableData = Omit<RegistrationData, "logo">;

export function saveRegistrationData(data: RegistrationData, step: number): void {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { logo, ...rest } = data;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(rest satisfies PersistableData));
        localStorage.setItem(STEP_KEY, String(step));
    } catch {
        // quota exceeded or private-browsing mode — fail silently
    }
}

export function loadRegistrationData(): {
    data: Partial<RegistrationData> | null;
    step: number;
} {
    try {
        const raw     = localStorage.getItem(STORAGE_KEY);
        const rawStep = localStorage.getItem(STEP_KEY);
        if (!raw) return { data: null, step: 1 };

        const data = JSON.parse(raw) as PersistableData;
        const step = rawStep ? Math.max(1, parseInt(rawStep, 10)) : 1;
        return { data: { ...data, logo: null }, step };
    } catch {
        return { data: null, step: 1 };
    }
}

export function clearRegistrationData(): void {
    try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STEP_KEY);
    } catch { /* ignore */ }
}

export function useRegistrationPersistence() {
    const save  = useCallback((data: RegistrationData, step: number) => saveRegistrationData(data, step), []);
    const load  = useCallback(() => loadRegistrationData(), []);
    const clear = useCallback(() => clearRegistrationData(), []);
    return { save, load, clear };
}