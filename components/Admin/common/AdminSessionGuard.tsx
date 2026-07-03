"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { companyService } from "@/lib/services/company-service";
import { fetchPersonalDetails } from "@/lib/services/user-service";

export default function AdminSessionGuard() {
  const { data: session } = useSession();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run this polling for ADMINs and MANAGERs
    const role = session?.user?.role?.toUpperCase();
    if (role !== "ADMIN" && role !== "MANAGER") return;

    const checkSessionAccess = async () => {
      if (!session?.user) return;
      try {
        if (role === "ADMIN") {
          // Fetch the list of companies this admin is currently assigned to
          const companies = await companyService.getMyCompanies();
          const activeCompanyId = session.user.companyId;

          if (activeCompanyId) {
            // If they have an active company, verify it's still in their assigned list
            const stillHasAccess = companies.some(
              (c: { companyId?: string; id?: string }) => c.companyId === activeCompanyId || c.id === activeCompanyId
            );
            
            if (!stillHasAccess) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              localStorage.removeItem("isLocked");
              await signOut({ callbackUrl: "/login?expired=true" });
            }
          } else if (companies.length === 0) {
            // If they have no active company AND no companies assigned at all
            if (intervalRef.current) clearInterval(intervalRef.current);
            await signOut({ callbackUrl: "/login?expired=true" });
          }
        } else if (role === "MANAGER") {
          // Fetch the manager's current personal profile which now includes branchId
          const profile = await fetchPersonalDetails(session.user.backendToken);
          const activeBranchId = session.user.branchId;

          if (profile.branchId && activeBranchId && profile.branchId !== activeBranchId) {
            // The manager's branch was changed by an owner/admin
            if (intervalRef.current) clearInterval(intervalRef.current);
            localStorage.removeItem("isLocked");
            await signOut({ callbackUrl: "/login?expired=true" });
          }
        }
      } catch (error: unknown) {
        // Fallback: if the request itself is forbidden, log them out
        const err = error as { response?: { status?: number }, status?: number, message?: string };
        const status = err?.response?.status || err?.status;
        if (status === 401 || status === 403 || err.message?.includes("401") || err.message?.includes("403")) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          localStorage.removeItem("isLocked");
          await signOut({ callbackUrl: "/login?expired=true" });
        }
      }
    };

    // Initial check
    checkSessionAccess();
    
    // Poll every 15 seconds
    intervalRef.current = setInterval(checkSessionAccess, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [session]);

  return null;
}
