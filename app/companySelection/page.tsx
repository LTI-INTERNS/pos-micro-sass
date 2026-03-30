"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { AlertCircle } from "lucide-react";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/companyCreation/Navigation";
import GlassBackground from "@/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import ActionButton from "@/components/Admin/common/ActionButton";
import CompanySelectItem from "@/components/saas/companySelection/CompanySelectItem";
import { companyService, Company } from "@/lib/services/company-service";

export default function CompanySelectPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();

  const [companies, setCompanies]   = useState<Company[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");

  // Prevents the "unauthenticated → redirect to /saaslogin" guard from
  // firing during the signOut → signIn window inside onSelectCompany.
  const isSelectingCompany = useRef(false);

  const role = session?.user?.role?.toUpperCase();

  // ── Fetch companies from the real API ────────────────────────────────────────
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await companyService.getMyCompanies();
      setCompanies(data);
    } catch {
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    // Only redirect once the session is definitively gone — not during hydration
    // and not while we're in the middle of the signOut → signIn swap.
    if (status === "unauthenticated") {
      if (!isSelectingCompany.current) router.replace("/saaslogin");
      return;
    }
    // Wait until role is hydrated — can be undefined briefly after navigation.
    if (!role) return;
    // Only OWNER and ADMIN reach this page.
    if (role !== "OWNER" && role !== "ADMIN") { router.replace("/overview"); return; }

    fetchCompanies();
  // router excluded from deps intentionally — new reference every render in
  // App Router would cause this effect to re-fire and hit the unauthenticated
  // branch during the session hydration window.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, role]);

  useEffect(() => {
    if (role !== "ADMIN" || loading || companies.length !== 1) return;
    onSelectCompany(companies[0].companyId);
  }, [role, loading, companies]);

  async function onSelectCompany(companyId: string) {
    setSelectedId(companyId);
    setError("");

    const chosen = companies.find((c: Company) => c.companyId === companyId);

    // ── Snapshot session fields NOW — they become null after signOut ───────
    const snapRole       = session?.user?.role       ?? "";
    const snapEmail      = session?.user?.email      ?? "";
    const snapName       = session?.user?.name       ?? "";
    const snapBranchId   = session?.user?.branchId   ?? "";
    const snapBranchName = session?.user?.branchName ?? "";
    const oldBackendToken = session?.user?.backendToken ?? "";

    // ── Step 1: Exchange old token for a fresh backend JWT ─────────────────
    // The backend will blacklist the old token immediately after issuing the
    // new one, so it can never be reused — even if it hasn't expired yet.
    let freshToken       = oldBackendToken;
    let freshCompanyName = chosen?.name ?? "";

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000'}/api/v1/auth/select-company`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oldBackendToken}`,
          },
          body: JSON.stringify({ companyId }),
        }
      );
      const json = await res.json();
      if (res.ok && json.success && json.data?.token) {
        freshToken       = json.data.token;
        freshCompanyName = json.data.companyName ?? freshCompanyName;
      } else {
        setError("Failed to select company. Please try again.");
        setSelectedId("");
        return;
      }
    } catch {
      setError("Network error while selecting company. Please try again.");
      setSelectedId("");
      return;
    }

    // ── Step 2: Clear the old NextAuth session (removes stale JWT cookie) ──
    // Set the guard BEFORE signOut so the unauthenticated useEffect doesn't
    // redirect to /saaslogin during the brief window between signOut and signIn.
    isSelectingCompany.current = true;
    await signOut({ redirect: false });

    // ── Step 3: Create a brand-new session with the fresh backend token ────
    // signOut above wiped the cookie, so signIn now writes a clean session
    // that carries the new companyId and the newly issued backend token.
    // Use the snapshotted values — session is null at this point.
    const result = await signIn("select-company", {
      redirect:    false,
      companyId,
      companyName: freshCompanyName,
      role:        snapRole,
      email:       snapEmail,
      name:        snapName,
      branchId:    snapBranchId,
      branchName:  snapBranchName,
      token:       freshToken,
    });

    isSelectingCompany.current = false;

    if (result?.error) {
      setError("Failed to establish company session. Please try again.");
      setSelectedId("");
      return;
    }

    // ── Step 4: Force NextAuth to propagate the new session ────────────────
    // Ensures apiClient's getSession() carries the new token on the very
    // first request after navigation.
    await update();

    router.push("/overview");
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (status === "loading" || loading) {
    return (
      <CommonLayout navbar={<Navigation title="Company Selection" />}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-white/50 text-sm animate-pulse">Loading companies...</div>
        </div>
      </CommonLayout>
    );
  }

  // ── Shared sub-components ────────────────────────────────────────────────────
  const ErrorBanner = error ? (
    <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
      <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
      <div>
        <p className="text-sm text-red-300">{error}</p>
        <button
          onClick={fetchCompanies}
          className="text-xs text-red-400 hover:text-red-300 underline mt-1"
        >
          Try again
        </button>
      </div>
    </div>
  ) : null;

  const EmptyState = !error && companies.length === 0 ? (
    <div className="py-10 text-center text-white/30 text-sm">
      No companies assigned to your account.
      <br />
      Please contact your administrator.
    </div>
  ) : null;

  const CompanyList = companies.length > 0 ? (
    <div className="space-y-4">
      {companies.map((c: Company) => (
        <CompanySelectItem
          key={c.companyId}
          name={c.name}
          type={c.businessType}
          selected={c.companyId === selectedId}
          onClick={() => onSelectCompany(c.companyId)}
        />
      ))}
    </div>
  ) : null;

  return (
    <CommonLayout navbar={<Navigation title="Company Selection" />}>
      <div className={`pt-10 pb-10 px-4 ${role === "ADMIN" ? "max-w-2xl mx-auto" : ""}`}>
        <GlassBackground className={role === "ADMIN" ? "w-full max-w-md mx-auto" : ""}>

          {/* ================= ADMIN VIEW ================= */}
          {role === "ADMIN" && (
            <div className="max-w-2xl mx-auto p-6 lg:p-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Select Your Company
              </h1>
              <p className="text-sm text-white/70 mb-8">
                Click a company to continue.
              </p>

              {ErrorBanner}
              {EmptyState}
              {CompanyList}

            </div>
          )}

          {/* ================= OWNER VIEW ================= */}
          {role === "OWNER" && (
            <SplitPanelLayout
              showDivider
              leftClassName="!p-6 lg:!p-8"
              rightClassName="!p-6 lg:!p-8"
              left={
                <div className="w-full max-w-lg">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    Select Your Company
                  </h1>
                  <p className="text-sm text-white/70 mb-8">
                    Click a company to continue.
                  </p>

                  {ErrorBanner}
                  {EmptyState}
                  {CompanyList}

                </div>
              }
              right={
                <div className="flex items-center justify-center">
                  <div className="max-w-md space-y-4">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                      <h3 className="text-xl font-semibold text-white">
                        Create a new company
                      </h3>
                      <p className="mt-2 text-sm text-white/70">
                        Don&apos;t see your company? Create one and start configuring
                        your system.
                      </p>

                      <div className="mt-6">
                        <ActionButton
                          className="py-4 text-base"
                          onClick={() => router.push("/companyregistration")}
                        >
                          Create Company
                        </ActionButton>
                      </div>
                    </div>

                    <div className="text-xs text-white/50 text-center">
                      Need help?{" "}
                      <span className="text-white/70">
                        info@lankatechinnovations.com
                      </span>
                    </div>
                  </div>
                </div>
              }
            />
          )}

        </GlassBackground>
      </div>
    </CommonLayout>
  );
}