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
import LoadingState from "@/components/Admin/common/LoadingState";
import RefreshButton from "@/components/Admin/common/RefreshButton";
import { usePosChannel } from "@/hooks/usePosChannel";
import { orderService } from "@/lib/services/order-service";
import CashierDeleteWarningModal, { CashierDeleteWarnings } from "@/components/Admin/cashiermanagement/CashierDeleteWarningModal";

function toTableCashier(c: ApiCashier): TableCashier {
  return {
    id:             c.id,
    name:           c.name,
    cashierNo:      c.cashierNo,
    branchId:       c.branchId,
    branchName:     c.branchName,
    email:          c.email,
    phone:          c.phone,
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

  // Broadcast deactivation events to any open POS tab
  const { send: sendPosMessage } = usePosChannel(() => {});

  const canSeeAllBranches = role === "OWNER" || role === "ADMIN";
  const effectiveBranchId = canSeeAllBranches ? undefined : branchId;

  const [query, setQuery]             = useState("");
  const [filterOpen, setFilterOpen]   = useState(false);
  const [addOpen, setAddOpen]         = useState(false);

  const [selectedCashier, setSelectedCashier] = useState<ApiCashier | null>(null);
  const [branches, setBranches] = useState<Branch[]>([]);

  const [deactivatePopupOpen, setDeactivatePopupOpen] = useState(false);
  const [deleteWarningOpen, setDeleteWarningOpen]     = useState(false);
  const [deleteWarnings, setDeleteWarnings]           = useState<CashierDeleteWarnings>({ orderCount: 0 });
  const [deleteLoading, setDeleteLoading]             = useState(false);
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
  const loadingData  = cashiersQuery.isLoading;
  const isRefetching = cashiersQuery.isFetching;
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
    const isDeactivating = selectedCashier.activeStatus; // true → being deactivated
    try {
      await cashierService.toggleStatus(selectedCashier.id, !selectedCashier.activeStatus);

      // If we just deactivated the cashier, broadcast to any open POS tab so they
      // are kicked out immediately without waiting for a poll cycle.
      if (isDeactivating) {
        sendPosMessage({ type: "CASHIER_DEACTIVATED", cashierId: selectedCashier.id });
      }

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

  async function handleDeleteClick() {
    if (!selectedCashier) {
      showToast("Please select a cashier first!", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      const branchOrders = await orderService.getAll({ branchId: selectedCashier.branchId });
      const cashierOrders = branchOrders.filter(
        (o) => o.cashier === selectedCashier.name
      );
      setDeleteWarnings({
        orderCount: cashierOrders.length,
      });
      setDeleteWarningOpen(true);
    } catch (err) {
      console.error("Failed to check cashier relations:", err);
      setDeleteWarnings({ orderCount: 0 });
      setDeleteWarningOpen(true);
    } finally {
      setDeleteLoading(false);
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
      setDeleteWarningOpen(false);
      showToast("Cashier deleted successfully!", "success");
    } catch {
      showToast("Failed to delete cashier. Please try again.", "error");
    } finally {
      setActionLoading(false);
    }
  }

  function handleEdit(updatedFields: TableCashier) {
    if (!selectedCashier) return;

    // ── Pre-save duplicate checks (client-side, before API call) ──────────────
    const otherCashiers = cashiers.filter((c) => c.id !== selectedCashier.id);
    const targetBranchId = updatedFields.branchId ?? selectedCashier.branchId;

    // Duplicate cashier number within the same branch
    const duplicateCashierNo = otherCashiers.some(
      (c) => c.branchId === targetBranchId && c.cashierNo === updatedFields.cashierNo
    );
    if (duplicateCashierNo) {
      showToast("Duplicate staff number in the same branch.", "error");
      return;
    }

    // Duplicate email across all cashiers
    const duplicateEmail = otherCashiers.some(
      (c) => c.email.toLowerCase() === updatedFields.email.toLowerCase()
    );
    if (duplicateEmail) {
      showToast("Email is already registered to another cashier.", "error");
      return;
    }

    // Duplicate phone across all cashiers
    if (updatedFields.phone) {
      const duplicatePhone = otherCashiers.some(
        (c) => c.phone && c.phone === updatedFields.phone
      );
      if (duplicatePhone) {
        showToast("Phone number is already registered to another cashier.", "error");
        return;
      }
    }
    // ─────────────────────────────────────────────────────────────────────────

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
      .catch((err: unknown) => {
        const error = err as { response?: { data?: { message?: string } }; message?: string };
        showToast(error.response?.data?.message || error.message || "Failed to update cashier.", "error");
        // We do NOT throw the error here, so the EditEntityModal stays open naturally.
      })
      .finally(() => setActionLoading(false));
  }

  function exportCsv(rows: TableCashier[]) {
    const header = canSeeAllBranches
      ? ["Name", "Cashier No", "Total Revenue", "Email", "Phone", "Branch", "Status"]
      : ["Name", "Cashier No", "Total Revenue", "Email", "Phone", "Status"];

    const csvRows = [
      header.join(","),
      ...rows.map((r) => {
        const values = canSeeAllBranches
          ? [r.name, r.cashierNo, r.totalRevenue, r.email, r.phone ?? "", r.branchName ?? "", r.status ?? "Active"]
          : [r.name, r.cashierNo, r.totalRevenue, r.email, r.phone ?? "", r.status ?? "Active"];
        return values
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",");
      }),
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
    { name: "phone", label: "Phone" },
    { name: "pin", label: "PIN", type: "password" as const },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">

        <CashierStatCardGrid />

        <div className="relative w-full">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
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

            <RefreshButton
              onClick={() => { void cashiersQuery.refetch(); }}
              loading={isRefetching}
              title="Refresh cashiers"
            />
          </div>
        </div>

        <CashierActionsBar
          role={role}
          onDeactivate={() => {
            if (!selectedCashier) {
              showToast("Please select a cashier first!", "error");
              return;
            }
            setDeactivatePopupOpen(true);
          }}
          onDelete={() => { void handleDeleteClick(); }}
          deleteLoading={deleteLoading}
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
          <LoadingState message="Loading cashiers..." className="py-24" />
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
            showBranch={canSeeAllBranches}
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

        {selectedCashier && deleteWarningOpen && (
          <CashierDeleteWarningModal
            isOpen={deleteWarningOpen}
            cashierName={selectedCashier.name}
            warnings={deleteWarnings}
            onClose={() => setDeleteWarningOpen(false)}
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
            validate={(values) => {
              const errors: Record<string, string> = {};
              
              if (values.name && !/[a-zA-Z]/.test(values.name)) {
                errors.name = "Name must contain at least one letter (only numbers not allowed)";
              } else if (values.name && values.name.trim().length < 5) {
                errors.name = "Name must be at least 5 characters";
              }

              const otherCashiers = cashiers.filter((c) => c.id !== values.id);

              if (values.email) {
                if (/[A-Z]/.test(values.email)) {
                  errors.email = "Email must contain lowercase letters only";
                }
                const emailExists = otherCashiers.some(
                  (c) => c.email.toLowerCase() === values.email.toLowerCase()
                );
                if (emailExists) {
                  errors.email = "Email is already registered to another cashier";
                }
              }

              if (values.phone) {
                const phoneExists = otherCashiers.some((c) => c.phone === values.phone);
                if (phoneExists) {
                  errors.phone = "Phone number is already registered to another cashier";
                }
              }

              if (values.cashierNo && values.branchId) {
                const numberExists = otherCashiers.some(
                  (c) => c.branchId === values.branchId && c.cashierNo === values.cashierNo
                );
                if (numberExists) {
                  errors.cashierNo = "Cashier number is already in use in this branch";
                }
              }

              return errors;
            }}
            onSave={handleEdit}
          />
        )}
      </div>

      {/* THE FIX: Render ToastNotification at the bottom */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}