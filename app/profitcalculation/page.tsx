"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useCSVExport } from "@/components/Admin/common/csvExport";
import ProfitTable from "@/components/Admin/profitcalculation/ProfitTable";
import ProfitStatCardGrid from "@/components/Admin/profitcalculation/ProfitStatCardGrid";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type {
  DateRangeParams,
  ProfitRow,
  ProfitSummary,
  ProfitPagination,
} from "@/types/analytics.types";

function toDateRangeParams(
  start: Date | undefined,
  end: Date | undefined,
  branchId?: string,
): DateRangeParams | undefined {
  const params: DateRangeParams = {};

  if (start) params.startDate = format(start, "yyyy-MM-dd'T'HH:mm:ss");
  if (end) params.endDate = format(end, "yyyy-MM-dd'T'HH:mm:ss");
  if (branchId) params.branchId = branchId;

  return Object.keys(params).length ? params : undefined;
}

const PAYMENT_OPTIONS = [
  { label: "Cash", value: "CASH" },
  { label: "Card", value: "CARD" },
  { label: "Split", value: "SPLIT" },
];

export default function ProfitPage() {
  const { data: session } = useSession();

  const role = session?.user?.role ?? "";
  const isSuperAdmin = ["OWNER", "ADMIN"].includes(role);

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();

  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<{
    payment?: string;
    branchId?: string;
  }>({});

  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);
  const [rows, setRows] = useState<ProfitRow[]>([]);
  const [summary, setSummary] = useState<ProfitSummary | undefined>();
  const [pagination, setPagination] = useState<ProfitPagination | undefined>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      setBranches([]);
      setFilters((prev) => ({ ...prev, branchId: "" }));
      return;
    }

    let cancelled = false;
    const range = toDateRangeParams(start, end);

    overviewAnalyticsService
      .getProfitReportBranches(range)
      .then((data) => {
        if (!cancelled) {
          setBranches(data);

          setFilters((prev) => {
            if (!prev.branchId || data.some((branch) => branch.id === prev.branchId)) {
              return prev;
            }

            return { ...prev, branchId: "" };
          });
        }
      })
      .catch(() => {
        if (!cancelled) setBranches([]);
      });

    return () => {
      cancelled = true;
    };
  }, [end, isSuperAdmin, start]);

  const branchOptions = useMemo(
    () => branches.map((branch) => ({ label: branch.name, value: branch.id })),
    [branches],
  );

  const filterLabelMap = useMemo(() => {
    const labels: Record<string, string> = {
      payment: "Payment Method",
      branchId: "Branch",
    };

    PAYMENT_OPTIONS.forEach((option) => {
      labels[`payment:${option.value}`] = option.label;
    });

    branchOptions.forEach((option) => {
      labels[`branchId:${option.value}`] = option.label;
    });

    return labels;
  }, [branchOptions]);

  const filterFields = useMemo(() => {
    const fields = [
      {
        name: "payment",
        placeholder: "Payment Method",
        options: PAYMENT_OPTIONS,
      },
    ];

    if (isSuperAdmin) {
      fields.unshift({
        name: "branchId",
        placeholder: "Branch",
        options: branchOptions,
      });
    }

    return fields;
  }, [branchOptions, isSuperAdmin]);

  const fetchReport = useCallback(async (targetPage: number) => {
    setLoading(true);
    try {
      const range = toDateRangeParams(start, end, isSuperAdmin ? filters.branchId : undefined);
      const result = await overviewAnalyticsService.getProfitReport(range, targetPage);
      setRows(result.rows);
      setSummary(result.summary);
      setPagination(result.pagination);
    } finally {
      setLoading(false);
    }
  }, [start, end, filters.branchId, isSuperAdmin]);

  useEffect(() => {
    setPage(1);
    fetchReport(1);
  }, [fetchReport]);

  const visibleRows = rows.filter((row) => {
    const matchSearch =
      !search ||
      row.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      row.branchName.toLowerCase().includes(search.toLowerCase());

    const matchPayment =
      !filters.payment || row.paymentMethod === filters.payment;

    return matchSearch && matchPayment;
  });

  const exportToCSV = useCSVExport<ProfitRow>();
  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />

        <ProfitStatCardGrid summary={summary} loading={loading} />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by order # or branch…"
            debounceMs={300}
            showClear
            showFilter
            onFilter={() => setShowFilter(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />

          <FilterChips
            filters={filters}
            labels={filterLabelMap}
            onRemove={(key) => setFilters((prev) => ({ ...prev, [key]: "" }))}
          />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={filterFields}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-[700px]">
          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(visibleRows, "Profit_Report.csv")}
          />
        </div>

        <ProfitTable rows={visibleRows} showBranch={isSuperAdmin} />

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-500">
              Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} orders)
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || loading}
                onClick={() => {
                  const p = page - 1;
                  setPage(p);
                  fetchReport(p);
                }}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
              >
                Previous
              </button>
              <button
                disabled={page >= pagination.totalPages || loading}
                onClick={() => {
                  const p = page + 1;
                  setPage(p);
                  fetchReport(p);
                }}
                className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
