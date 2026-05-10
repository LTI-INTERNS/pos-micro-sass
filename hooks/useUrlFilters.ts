import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export function useUrlFilters() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const setFilter = useCallback((key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`${pathname}?${params.toString()}`);
    }, [router, pathname, searchParams]);

    const clearFilters = useCallback(() => {
        router.push(pathname);
    }, [router, pathname]);

    return {
        filters: Object.fromEntries(searchParams.entries()),
        setFilter,
        clearFilters,
    };
}
