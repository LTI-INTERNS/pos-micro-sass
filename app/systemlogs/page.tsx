"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RefreshButton from "@/components/Admin/common/RefreshButton";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import FilterChips from "@/components/Admin/common/FilterChips";
import SystemLogTable from "@/components/Admin/systemlogs/SystemLogTable";
import LoadingState from "@/components/Admin/common/LoadingState";
import {
  systemLogService,
  type SystemLogFilters,
  type SystemLogEntry,
  type SystemActionType,
} from "@/lib/services/system-log-service";

const ACTION_OPTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "REFUND",
].map((v) => ({ label: v, value: v }));

const ENTITY_OPTIONS = [
  "Product",
  "Expense",
  "Auth",
  "Staff",
  "Branch",
  "Supplier",
].map((v) => ({ label: v, value: v }));

export default function SystemLogsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const role =
    typeof session?.user?.role === "string"
      ? session.user.role.toUpperCase()
      : "";

  // Redirect non-owners
  useEffect(() => {
    if (status === "loading") return;
    if (role !== "OWNER") router.replace("/overview");
  }, [role, status, router]);

  // ── Data state ────────────────────────────────────────────────────────────
  const [logs, setLogs] = useState<SystemLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Filter state (mirrors pattern from ExpensesContent) ───────────────────
  const [search, setSearch] = useState("");
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<{
    action?: string;
    entity?: string;
  }>({});
  const [page, setPage] = useState(1);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    if (role !== "OWNER") return;
    setLoading(true);
    try {
      const apiFilters: SystemLogFilters = {
        page,
        limit: 50,
        ...(filters.action && { actionType: filters.action as SystemActionType }),
        ...(filters.entity && { entityType: filters.entity }),
        ...(start && { startDate: start.toISOString() }),
        ...(end && { endDate: end.toISOString() }),
      };
      const result = await systemLogService.getLogs(apiFilters);
      setLogs(result.logs);
      setTotal(result.total);
      setTotalPages(result.totalPages);
    } catch {
      // silently keep current data on error
    } finally {
      setLoading(false);
    }
  }, [role, page, filters, start, end]);

  useEffect(() => {
    if (status === "authenticated" && role === "OWNER") {
      void fetchLogs();
    }
  }, [status, fetchLogs, role]);

  // ── Client-side search across loaded page ────────────────────────────────
  const searchedLogs = search.trim()
    ? logs.filter((l) =>
      [l.entityType, l.role, l.actionType, l.message ?? "", l.branch?.name ?? ""]
        .some((v) => v.toLowerCase().includes(search.toLowerCase()))
    )
    : logs;

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  const removeFilter = (key: string) =>
    setFilters((prev) => ({ ...prev, [key]: "" }));

  if (status === "loading" || role !== "OWNER") return null;

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">

        {/* Date range */}
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => { setStart(s); setEnd(e); setPage(1); }}
        />

        {/* Search + Filter + Refresh */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search logs..."
              debounceMs={300}
              showFilter
              filterLabel="Filter"
              onFilter={() => setShowFilter(true)}
              isFilterApplied={isFilterApplied}
              onClearFilters={() => {
                setFilters({});
                setSearch("");
                setStart(undefined);
                setEnd(undefined);
                setPage(1);
              }}
            />

            <FilterChips filters={filters} onRemove={removeFilter} />

            <FilterPopup
              open={showFilter}
              onClose={() => setShowFilter(false)}
              onApply={(values) => {
                setFilters(values);
                setShowFilter(false);
                setPage(1);
              }}
              fields={[
                {
                  name: "action",
                  placeholder: "Action Type",
                  options: ACTION_OPTIONS,
                },
                {
                  name: "entity",
                  placeholder: "Entity",
                  options: ENTITY_OPTIONS,
                },
              ]}
            />
          </div>

          <RefreshButton
            onClick={() => { setPage(1); void fetchLogs(); }}
            loading={loading}
            title="Refresh logs"
          />
        </div>

        {/* Table */}
        {loading ? (
          <LoadingState message="Loading log data..." className="py-24" />
        ) : (
          <SystemLogTable
            logs={searchedLogs}
            expandedId={expandedId}
            onExpand={setExpandedId}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-4 py-3">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} · {total.toLocaleString()} total entries
            </p>
            <div className="flex gap-2">
              <ActionButton
                label="← Prev"
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              />
              <ActionButton
                label="Next →"
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              />
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
