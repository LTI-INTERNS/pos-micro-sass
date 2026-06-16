"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { branchService } from "@/lib/services/branch-service";
import CashierStatCardGrid from "@/components/Admin/cashiermanagement/cashierStatCardGrid";
import { queryKeys } from "@/lib/query-keys";
import type { Branch } from "@/types/branch.types";
import type { Cashier as ApiCashier, UpdateCashierInput } from "@/types/cashier.types";

// THE FIX: Import our global toast system
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

function toTableCashier(c: ApiCashier): TableCashier {
  return {
    id:             c.id,
    name:           c.name,
    cashierNo:      c.cashierNo,
    branchId:       c.branchId,
    branchName:     c.branchName,
    email:          c.email,
    imgUrl:         c.imgUrl,
    totalRevenue:   c.totalRevenue ?? 0,
    passwordMasked: "*****",
    pinMasked:      "****",
    status:         c.activeStatus ? "Active" : "Deactive",
  };
}

export default function CashierManagementPage() {
  const { data: session, status } = useSession();
  const role     = session?.user?.role   ?? "";
  const branchId = session?.user?.branchId ?? "";
  const queryClient = useQueryClient();

  // THE FIX: Initialize the toast hook
  const { toasts, showToast, dismissToast } = useToast();

  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";
  const effectiveBranchId = canSeeAllBranches ? undefined : branchId;

  const [query, setQuery]             = useState("");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [addOpen, setAddOpen]         = useState(false);

  const [selectedCashier, setSelectedCashier] = useState<ApiCashier | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [deactivatePopupOpen, setDeactivatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen]         = useState(false);
  const [editPopupOpen, setEditPopupOpen]             = useState(false);
  const [actionLoading, setActionLoading]             = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    revenueRange: "",
    status:       "",
    branch:       "",
  });

  const cashiersQuery = useQuery({
    queryKey: queryKeys.cashiers.list(effectiveBranchId),
    queryFn: async () => {
      const [data, stats] = await Promise.all([
        cashierService.getAll(),
        cashierService.getStats(effectiveBranchId).catch(() => null),
      ]);
      const revenueMap = new Map(
        (stats?.revenueByMonth ?? []).map((r) => [r.cashierId, r.revenue])
      );
      return data.map((c) => ({
        ...c,
        totalRevenue: revenueMap.get(c.id) ?? 0,
      }));
    },
    enabled: status === "authenticated",
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
  const cashiers = useMemo(() => cashiersQuery.data ?? [], [cashiersQuery.data]);
  const loadingData = cashiersQuery.isLoading;
  const fetchError = cashiersQuery.isError
    ? "Failed to load cashiers. Please try again."
    : "";

  useEffect(() => {
    if (!canSeeAllBranches) setFilters((prev) => ({ ...prev, branch: "" }));
  }, [canSeeAllBranches]);

  useEffect(() => {
    if (status !== "authenticated" || !canSeeAllBranches) return;

    branchService
      .getAll()
      .then(setBranches)
      .catch(() => setBranches([]));
  }, [status, canSeeAllBranches]);

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


  function handleSelectRow(row: TableCashier | null) {
    if (!row) { setSelectedCashier(null); return; }
    setSelectedCashier(cashiers.find((c) => c.id === row.id) ?? null);
  }

  const selectedTableCashier: TableCashier | null = selectedCashier
    ? toTableCashier(selectedCashier)
    : null;

  async function handleToggleStatus() {
    if (!selectedCashier) return;
    setActionLoading(true);
    try {
      await cashierService.toggleStatus(selectedCashier.id, !selectedCashier.activeStatus);
      setSelectedCashier(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.list(effectiveBranchId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.stats(effectiveBranchId) }),
      ]);
      setDeactivatePopupOpen(false);
      showToast("Cashier status updated successfully!", "success");
    } catch {
      showToast("Failed to update cashier status. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedCashier) return;
    setActionLoading(true);
    try {
      await cashierService.remove(selectedCashier.id);
      setSelectedCashier(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.list(effectiveBranchId) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.stats(effectiveBranchId) }),
      ]);
      setDeletePopupOpen(false);
      showToast("Cashier deleted successfully!", "success");
    } catch {
      showToast("Failed to delete cashier. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  }

  function handleEdit(updatedFields: TableCashier) {
    if (!selectedCashier) return;
    setActionLoading(true);

    const payload: UpdateCashierInput = {
      ...(canSeeAllBranches ? { branchId: updatedFields.branchId } : {}),
      cashierNo: updatedFields.cashierNo,
      name:      updatedFields.name,
      email:     updatedFields.email,
      ...(updatedFields.imgUrl !== undefined
        ? { imgUrl: updatedFields.imgUrl ?? "" }
        : {}),
    };

    cashierService
      .update(selectedCashier.id, payload)
      .then(async () => {
        setSelectedCashier(null);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.list(effectiveBranchId) }),
          queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.stats(effectiveBranchId) }),
        ]);
        setEditPopupOpen(false);
        showToast("Cashier updated successfully!", "success");
      })
      .catch((err: any) => {
        showToast(err.response?.data?.message || err.message || "Failed to update cashier.", "error");
        // We do NOT throw the error here, so the EditEntityModal stays open naturally.
      })
      .finally(() => setActionLoading(false));
  }

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
  const branchEditOptions =
    branches.length > 0
      ? branches.map((branch) => ({ label: branch.name, value: branch.id }))
      : Array.from(
          new Map(
            cashiers
              .filter((c) => c.branchId && c.branchName)
              .map((c) => [c.branchId, { label: c.branchName!, value: c.branchId }])
          ).values()
        );

  const editFields: EditField[] = [
    { name: "imgUrl", label: "Profile Photo", type: "image", uploadFolder: "cashiers" },
    { name: "name", label: "Name" },
    { name: "cashierNo", label: "Cashier No" },
    ...(canSeeAllBranches
      ? [
          {
            name: "branchId",
            label: "Branch Name",
            type: "select" as const,
            options: branchEditOptions,
          },
        ]
      : [{ name: "branchName", label: "Branch Name", readOnly: true }]),
    { name: "email", label: "Email" },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">

        <CashierStatCardGrid />

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
          role={role}
          showToast={showToast} // THE FIX: Pass showToast down
          onDeactivate={() => {
            if (!selectedCashier) {
              showToast("Please select a cashier first!", "error");
              return;
            }
            setDeactivatePopupOpen(true);
          }}
          onDelete={() => {
            if (!selectedCashier) {
              showToast("Please select a cashier first!", "error");
              return;
            }
            setDeletePopupOpen(true);
          }}
          onEdit={() => {
            if (!selectedCashier) {
              showToast("Please select a cashier first!", "error");
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
            <button className="ml-3 underline hover:text-red-300" onClick={() => void cashiersQuery.refetch()}>
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

        <AddCashierForm
          isOpen={addOpen}
          showToast={showToast} // THE FIX: Pass showToast down
          onClose={() => { setAddOpen(false); }}
          onSaved={async () => {
            setAddOpen(false);
            await Promise.all([
              queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.list(effectiveBranchId) }),
              queryClient.invalidateQueries({ queryKey: queryKeys.cashiers.stats(effectiveBranchId) }),
            ]);
          }}
        />

        <DeactivateCashierPopup
          isOpen={deactivatePopupOpen}
          onClose={() => { setDeactivatePopupOpen(false); }}
          cashier={selectedTableCashier ?? undefined}
          onConfirm={handleToggleStatus}
        />

        {selectedCashier && (
          <DeletePopup
            isOpen={deletePopupOpen}
            onClose={() => { setDeletePopupOpen(false); }}
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
            title={actionLoading ? "Saving…" : "Edit Cashier"}
            initialValues={selectedTableCashier!}
            fields={editFields}
            onClose={() => { setEditPopupOpen(false); }}
            onSave={handleEdit}
          />
        )}
      </div>

      {/* THE FIX: Render ToastNotification at the bottom */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}