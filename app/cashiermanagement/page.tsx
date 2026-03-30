"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import CashierActionsBar from "@/components/Admin/cashiermanagement/CashierActionsBar";
import CashiersTable, { type Cashier as TableCashier } from "@/components/Admin/cashiermanagement/CashiersTable";
import { AddCashierForm } from "@/components/Admin/cashiermanagement/AddCashierForm";
import FilterChips from "@/components/Admin/common/FilterChips";
import DeactivateCashierPopup from "@/components/Admin/cashiermanagement/DeactivateCashierPopup";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import { cashierService } from "@/lib/services/cashier-service";
import type { Cashier as ApiCashier, UpdateCashierInput } from "@/types/cashier.types";

// ── Adapter: backend ApiCashier → CashiersTable's local TableCashier ──────────
// CashiersTable defines its own Cashier type with passwordMasked, pinMasked,
// and status as "Active" | "Deactive". We adapt the backend shape here so the
// rest of the page can work with the clean ApiCashier type.
function toTableCashier(c: ApiCashier): TableCashier {
  return {
    id:             c.id,
    name:           c.name,
    cashierNo:      c.cashierNo,
    email:          c.email,
    imgUrl:         c.imgUrl,
    totalRevenue:   c.totalRevenue ?? 0,
    passwordMasked: "*****",
    pinMasked:      "****",
    status:         c.activeStatus ? "Active" : "Deactive",
  };
}

export default function CashierManagementPage() {
  const { data: session } = useSession();
  const role     = session?.user?.role   ?? "";
  const branchId = session?.user?.branchId ?? "";

  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";

  // ── Server state (backend shape) ──────────────────────────────────────────
  const [cashiers, setCashiers]       = useState<ApiCashier[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [fetchError, setFetchError]   = useState("");

  // ── UI state ──────────────────────────────────────────────────────────────
  const [query, setQuery]             = useState("");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [addOpen, setAddOpen]         = useState(false);

  // selectedCashier is the full ApiCashier — actions always work on this
  const [selectedCashier, setSelectedCashier] = useState<ApiCashier | null>(null);

  const [deactivatePopupOpen, setDeactivatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen]         = useState(false);
  const [editPopupOpen, setEditPopupOpen]             = useState(false);
  const [actionLoading, setActionLoading]             = useState(false);
  const [actionError, setActionError]                 = useState("");

  const [filters, setFilters] = useState<Record<string, string>>({
    revenueRange: "",
    status:       "",
    branch:       "",
  });

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchCashiers = useCallback(async () => {
    try {
      setLoadingData(true);
      setFetchError("");
      const data = await cashierService.getAll();
      setCashiers(data);
    } catch {
      setFetchError("Failed to load cashiers. Please try again.");
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { fetchCashiers(); }, [fetchCashiers]);

  useEffect(() => {
    if (!canSeeAllBranches) setFilters((prev) => ({ ...prev, branch: "" }));
  }, [canSeeAllBranches]);

  // ── Filter fields ─────────────────────────────────────────────────────────
  const filterFields: SelectField[] = useMemo(() => {
    const branchOptions = canSeeAllBranches
      ? Array.from(new Set(cashiers.map((c) => c.branchName ?? "").filter(Boolean)))
          .map((b) => ({ label: b, value: b }))
      : [];

    return [
      ...(canSeeAllBranches
        ? [{ name: "branch", placeholder: "Select Branch", options: branchOptions } as SelectField]
        : []),
      {
        name: "revenueRange",
        placeholder: "Select Revenue Range",
        options: [
          { label: "Below 100,000", value: "lt100k" },
          { label: "100,000 and Above", value: "gte100k" },
        ],
      },
      {
        name: "status",
        placeholder: "Select Status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Deactive", value: "Deactive" },
        ],
      },
    ];
  }, [canSeeAllBranches, cashiers]);

  // ── Filter → adapt to TableCashier for the table ──────────────────────────
  const filteredTableCashiers: TableCashier[] = useMemo(() => {
    const q = query.trim().toLowerCase();

    const base = canSeeAllBranches
      ? cashiers
      : cashiers.filter((c) => c.branchId === branchId);

    return base
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.cashierNo.toLowerCase().includes(q)
        );
      })
      .filter((c) => {
        const statusStr = c.activeStatus ? "Active" : "Deactive";
        if (filters.revenueRange === "lt100k"  && (c.totalRevenue ?? 0) >= 100000) return false;
        if (filters.revenueRange === "gte100k" && (c.totalRevenue ?? 0) <  100000) return false;
        if (filters.status && statusStr !== filters.status)                          return false;
        if (canSeeAllBranches && filters.branch && c.branchName !== filters.branch)  return false;
        return true;
      })
      .map(toTableCashier);
  }, [query, filters, cashiers, canSeeAllBranches, branchId]);

  // ── Row selection bridge ───────────────────────────────────────────────────
  // Table gives us a TableCashier row; we look up the full ApiCashier by id.
  function handleSelectRow(row: TableCashier | null) {
    if (!row) { setSelectedCashier(null); return; }
    setSelectedCashier(cashiers.find((c) => c.id === row.id) ?? null);
  }

  // Derived table row for popups that expect TableCashier
  const selectedTableCashier: TableCashier | null = selectedCashier
    ? toTableCashier(selectedCashier)
    : null;

  // ── Actions ───────────────────────────────────────────────────────────────
  async function handleToggleStatus() {
    if (!selectedCashier) return;
    setActionLoading(true);
    setActionError("");
    try {
      const updated = await cashierService.toggleStatus(selectedCashier.id, !selectedCashier.activeStatus);
      setCashiers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      setSelectedCashier(updated);
      setDeactivatePopupOpen(false);
    } catch {
      setActionError("Failed to update cashier status. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedCashier) return;
    setActionLoading(true);
    setActionError("");
    try {
      await cashierService.remove(selectedCashier.id);
      setCashiers((prev) => prev.filter((c) => c.id !== selectedCashier.id));
      setSelectedCashier(null);
      setDeletePopupOpen(false);
    } catch {
      setActionError("Failed to delete cashier. Please try again.");
    } finally {
      setActionLoading(false);
    }
  }

  // EditEntityModal.onSave is typed as (values: T) => void (not async).
  // We kick off the async call inside and surface errors via actionError.
  function handleEdit(updatedFields: TableCashier) {
    if (!selectedCashier) return;
    setActionLoading(true);
    setActionError("");

    const payload: UpdateCashierInput = {
      cashierNo: updatedFields.cashierNo,
      name:      updatedFields.name,
      email:     updatedFields.email,
    };

    cashierService
      .update(selectedCashier.id, payload)
      .then((updated) => {
        setCashiers((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        setSelectedCashier(updated);
        setEditPopupOpen(false);
      })
      .catch(() => setActionError("Failed to update cashier. Please try again."))
      .finally(() => setActionLoading(false));
  }

  // ── CSV export ────────────────────────────────────────────────────────────
  function exportCsv(rows: TableCashier[]) {
    const header = ["Name", "Cashier No", "Total Revenue", "Email", "Status"];

    const csvRows = [
      header.join(","),
      ...rows.map((r) =>
        [r.name, r.cashierNo, r.totalRevenue, r.email, r.status ?? "Active"]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashiers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  const isFilterApplied = Object.values(filters).some((v) => v.trim() !== "");
  const removeFilter    = (key: string) => setFilters((prev) => ({ ...prev, [key]: "" }));

  const editFields: EditField[] = [
    { name: "imgUrl", label: "Profile Photo", type: "image" },
    { name: "name", label: "Name" },
    { name: "cashierNo", label: "Cashier No" },
    { name: "email", label: "Email" },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">

        {actionError && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
            {actionError}
            <button
              className="ml-3 underline text-red-400 hover:text-red-300"
              onClick={() => setActionError("")}
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="relative w-full">
          <SearchBar
            placeholder="Search Cashier..."
            value={query}
            onChange={setQuery}
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({ revenueRange: "", status: "", branch: "" })}
          />

          <FilterChips filters={filters} onRemove={removeFilter} />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => setFilters(values)}
          />
        </div>

        <CashierActionsBar
          onDeactivate={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setDeactivatePopupOpen(true);
          }}
          onDelete={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setDeletePopupOpen(true);
          }}
          onEdit={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setEditPopupOpen(true);
          }}
          onAdd={() => setAddOpen(true)}
          onExport={() => exportCsv(filteredTableCashiers)}
        />

        {loadingData ? (
          <div className="py-16 text-center text-white/40 text-sm animate-pulse">
            Loading cashiers…
          </div>
        ) : fetchError ? (
          <div className="py-10 text-center text-red-400 text-sm">
            {fetchError}
            <button className="ml-3 underline hover:text-red-300" onClick={fetchCashiers}>
              Retry
            </button>
          </div>
        ) : (
          <CashiersTable
            cashiers={filteredTableCashiers}
            selectedRowId={selectedTableCashier?.id}
            onSelectRow={handleSelectRow}
          />
        )}

        {/* AddCashierForm — refetch after close to pick up the new record */}
        <AddCashierForm
          isOpen={addOpen}
          onClose={() => { setAddOpen(false); fetchCashiers(); }}
        />

        {/* DeactivateCashierPopup — expects TableCashier, no loading prop */}
        <DeactivateCashierPopup
          isOpen={deactivatePopupOpen}
          onClose={() => { setDeactivatePopupOpen(false); setActionError(""); }}
          cashier={selectedTableCashier ?? undefined}
          onConfirm={handleToggleStatus}
        />

        {selectedCashier && (
          <DeletePopup
            isOpen={deletePopupOpen}
            onClose={() => { setDeletePopupOpen(false); setActionError(""); }}
            item={selectedTableCashier!}
            itemName="Cashier"
            getDisplayText={(c) => (
              <>
                <br />
                <br />
                ID - {c.id}
                <br />
                Cashier Name- {c.name}
              </>
            )}
            onConfirm={handleDelete}
          />
        )}

        {selectedCashier && editPopupOpen && (
          <EditEntityModal<TableCashier>
            open={editPopupOpen}
            title="Edit Cashier"
            initialValues={selectedTableCashier!}
            fields={editFields}
            onClose={() => { setEditPopupOpen(false); setActionError(""); }}
            onSave={handleEdit}
          />
        )}
      </div>
    </DashboardLayout>
  );
}