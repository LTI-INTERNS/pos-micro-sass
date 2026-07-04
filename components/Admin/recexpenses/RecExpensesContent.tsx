"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import RecurringExpensesTable, {
  RecurringExpenses,
} from "@/components/Admin/recexpenses/RecExpensesTable";
import StatCardGrid from "@/components/Admin/recexpenses/RecStatCardGrid";
import AddRecExpensesPopup from "@/components/Admin/recexpenses/AddRecExpensesPopup";
import {
  BranchItem,
  recurringExpenseApi,
  RecurringExpenseApiItem,
  RecurringExpenseCategoryItem,
} from "@/lib/api/recurringExpenses";
import {
  useTableFilters,
  getFilterOptions,
} from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useCSVExport } from "@/components/Admin/common/csvExport";

// THE FIX: Import our global toast system
import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";

type UserRole = "owner" | "admin" | "manager";

const normalizeRecurringExpense = (
  item: RecurringExpenseApiItem
): RecurringExpenses => ({
  id: item.recExpensesId,
  recExpenseId: item.recExpensesId,
  date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
  category: item.category?.category ?? "",
  categoryId: item.categoryId,
  description: item.description ?? "",
  amount: Number(item.amount ?? 0),
  payment: item.paymentType ?? "",
  paymentType: (item.paymentType ?? "CASH") as "CASH" | "CARD",
  addedby: item.addedByName ?? "",
  branch: item.branch?.name ?? "",
  branchId: item.branchId,
});

export default function RecurringExpensesContent() {
  const { data: session, status } = useSession();

  // THE FIX: Initialize the toast hook
  const { toasts, showToast, dismissToast } = useToast();

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showRecExpensePopup, setShowRecExpensePopup] = useState(false);

  const [recurringExpenses, setRecurringExpenses] = useState<RecurringExpenses[]>([]);
  const [categories, setCategories] = useState<RecurringExpenseCategoryItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editingRecExpense, setEditingRecExpense] = useState<RecurringExpenses | null>(null);
  const [selectedRecExpense, setSelectedRecExpense] = useState<RecurringExpenses | null>(null);

  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
    addedby?: string;
    branch?: string;
  }>({});

  const sessionRole =
    typeof session?.user?.role === "string"
      ? session.user.role.toLowerCase()
      : undefined;

  const role: UserRole | undefined =
    sessionRole === "owner" ||
    sessionRole === "admin" ||
    sessionRole === "manager"
      ? sessionRole
      : undefined;

  const branchName = session?.user?.branchName?.trim() ?? "";

  const isOwner = role === "owner";
  const isAdmin = role === "admin";
  const canUseBranchFilter = isOwner || isAdmin;
  const showBranchColumn = isOwner || isAdmin;

  const fetchAll = useCallback(async () => {
    if (!session) return;

    try {
      setPageLoading(true);

      const [rows, categoryRows, branchRows] = await Promise.all([
        recurringExpenseApi.getRecurringExpenses(session),
        recurringExpenseApi.getRecurringExpenseCategories(session),
        recurringExpenseApi.getBranches(session).catch(() => []),
      ]);

      const normalizedRows = rows.map(normalizeRecurringExpense);

      setRecurringExpenses(normalizedRows);
      setCategories(categoryRows);
      setBranches(branchRows);

      setSelectedRecExpense((prev) => {
        if (!prev) return null;
        return (
          normalizedRows.find((item) => item.recExpenseId === prev.recExpenseId) ??
          null
        );
      });
    } catch (error: unknown) {
      console.error("Failed to load recurring expenses:", error);
      const err = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      showToast(
        err?.response?.data?.error?.message ||
          "Failed to load recurring expense data.",
        "error"
      ); // THE FIX: Toast instead of alert
    } finally {
      setPageLoading(false);
    }
  }, [session, showToast]);

  useEffect(() => {
    if (status === "authenticated") {
      void fetchAll();
    }
  }, [status, fetchAll]);

  const branchFilteredRecurringExpenses = useMemo(() => {
    if (status === "loading") return [];

    if (isOwner || isAdmin) return recurringExpenses;
    if (!branchName) return recurringExpenses;

    return recurringExpenses.filter(
      (e) => e.branch.trim().toLowerCase() === branchName.toLowerCase()
    );
  }, [status, isOwner, isAdmin, branchName, recurringExpenses]);

  const visibleFilters = canUseBranchFilter
    ? filters
    : Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "branch")
      );

  const categoryOptions = getFilterOptions(
    branchFilteredRecurringExpenses,
    "category"
  );
  const paymentOptions = getFilterOptions(
    branchFilteredRecurringExpenses,
    "payment"
  );
  const addedByOptions = getFilterOptions(
    branchFilteredRecurringExpenses,
    "addedby"
  );
  const branchOptions = getFilterOptions(recurringExpenses, "branch");

  const filteredRecurringExpenses = useTableFilters<RecurringExpenses>({
    data: branchFilteredRecurringExpenses,
    search,
    start,
    end,
    dateKey: "date",
    searchKeys: ["id", "category", "description"],
    filters: canUseBranchFilter ? filters : { ...filters, branch: "" },
  });

  useEffect(() => {
    if (!selectedRecExpense) return;

    const stillExists = filteredRecurringExpenses.find(
      (item) => item.recExpenseId === selectedRecExpense.recExpenseId
    );

    if (!stillExists) {
      setSelectedRecExpense(null);
    }
  }, [filteredRecurringExpenses, selectedRecExpense]);

  const isFilterApplied = Object.values(visibleFilters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    if (!canUseBranchFilter && key === "branch") return;

    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const exportCSV = useCSVExport<RecurringExpenses>();

  const resetPopupState = () => {
    setShowRecExpensePopup(false);
    setEditingRecExpense(null);
  };

  const handleCreate = async (values: {
    categoryId: string;
    date: string;
    description: string;
    amount: number;
    paymentType: "CASH" | "CARD";
    branchId?: string;
  }) => {
    try {
      setSaveLoading(true);
      await recurringExpenseApi.createRecurringExpense(session, values);
      await fetchAll();
      showToast("Recurring expense added successfully!", "success"); // THE FIX: Added success toast
      resetPopupState();
    } catch (error: unknown) {
      console.error("Create recurring expense failed:", error);
      const err = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      showToast(
        err?.response?.data?.error?.message ||
          "Failed to create recurring expense.",
        "error"
      ); // THE FIX: Toast instead of alert
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdate = async (values: {
    categoryId: string;
    date: string;
    description: string;
    amount: number;
    paymentType: "CASH" | "CARD";
    branchId?: string;
  }) => {
    if (!editingRecExpense) return;

    try {
      setSaveLoading(true);
      await recurringExpenseApi.updateRecurringExpense(
        session,
        editingRecExpense.recExpenseId,
        values
      );
      await fetchAll();
      showToast("Recurring expense updated successfully!", "success"); // THE FIX: Added success toast
      resetPopupState();
    } catch (error: unknown) {
      console.error("Update recurring expense failed:", error);
      const err = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      showToast(
        err?.response?.data?.error?.message ||
          "Failed to update recurring expense.",
        "error"
      ); // THE FIX: Toast instead of alert
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDeleteClick = () => {
    if (!selectedRecExpense) {
      showToast("Please select a recurring expense first.", "error");
      return;
    }

    setDeletePopupOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedRecExpense) return;

    try {
      setDeleteLoading(true);
      await recurringExpenseApi.deleteRecurringExpense(
        session,
        selectedRecExpense.recExpenseId
      );
      setDeletePopupOpen(false);
      setSelectedRecExpense(null);
      await fetchAll();
      showToast("Recurring expense deleted successfully!", "success");
    } catch (error: unknown) {
      console.error("Delete recurring expense failed:", error);
      const err = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
      showToast(
        err?.response?.data?.error?.message ||
          "Failed to delete recurring expense.",
        "error"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const isLoading = status === "loading" || pageLoading;

  return (
    <div className="w-full space-y-5">
      

      {/* <StatCardGrid recurringexpenses={filteredRecurringExpenses} /> */}
      <StatCardGrid recurringexpenses={recurringExpenses} />

      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
      />

      <div className="relative">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Recurring Expenses..."
          debounceMs={300}
          showFilter
          filterLabel="Filter"
          onFilter={() => setShowFilter(true)}
          isFilterApplied={isFilterApplied}
          onClearFilters={() => setFilters({})}
        />

        <FilterChips filters={visibleFilters} onRemove={removeFilter} />

        <FilterPopup
          open={showFilter}
          onClose={() => setShowFilter(false)}
          onApply={(values) => {
            const nextValues = canUseBranchFilter
              ? values
              : { ...values, branch: "" };

            setFilters(nextValues);
            setShowFilter(false);
          }}
          fields={[
            ...(canUseBranchFilter
              ? [{ name: "branch", placeholder: "Branch", options: branchOptions }]
              : []),
            { name: "category", placeholder: "Category", options: categoryOptions },
            { name: "payment", placeholder: "Payment", options: paymentOptions },
            { name: "addedby", placeholder: "Added By", options: addedByOptions },
          ]}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionButton
          label="Add Recurring Expense"
          variant="primary"
          onClick={() => {
            setEditingRecExpense(null);
            setShowRecExpensePopup(true);
          }}
        />

        <ActionButton
          label="Edit Recurring Expense"
          variant="outline"
          onClick={() => {
            if (!selectedRecExpense) {
              showToast("Please select a recurring expense first.", "error"); // THE FIX: Toast instead of alert
              return;
            }

            setEditingRecExpense(selectedRecExpense);
            setShowRecExpensePopup(true);
          }}
        />

        <ActionButton
          label="Delete Recurring Expense"
          variant="outline"
          onClick={handleDeleteClick}
        />

        <ActionButton
          label="Export CSV"
          variant="primary"
          onClick={() =>
            exportCSV(filteredRecurringExpenses, "RecurringExpenses.csv")
          }
        />
      </div>

      {isLoading ? (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
            Loading recurring expenses...
          </div>
        ) : (
          <RecurringExpensesTable
            RecurringExpenses={filteredRecurringExpenses}
            showBranch={showBranchColumn}
            selectedRecExpenseId={selectedRecExpense?.id}
            onSelectRecExpense={setSelectedRecExpense}
          />
        )}

      <AddRecExpensesPopup
        open={showRecExpensePopup}
        onClose={resetPopupState}
        onSave={editingRecExpense ? handleUpdate : handleCreate}
        categories={categories}
        branches={branches}
        loading={saveLoading}
        mode={editingRecExpense ? "edit" : "create"}
        initialValues={
          editingRecExpense
            ? {
                recExpensesId: editingRecExpense.recExpenseId,
                date: editingRecExpense.date,
                categoryId: editingRecExpense.categoryId,
                description: editingRecExpense.description,
                amount: editingRecExpense.amount,
                paymentType: editingRecExpense.paymentType,
                branchId: editingRecExpense.branchId,
              }
            : null
        }
      />

      {selectedRecExpense && (
        <DeletePopup
          isOpen={deletePopupOpen}
          onClose={() => setDeletePopupOpen(false)}
          item={selectedRecExpense}
          itemName="Recurring Expense"
          getDisplayText={(expense) => (
            <>
              <br />
              <br />
              ID - {expense.id}
              <br />
              Description - {expense.description || "N/A"}
              <br />
              Amount - {expense.amount}
              {deleteLoading && (
                <span className="block mt-2 text-gray-400 text-sm">Deleting...</span>
              )}
            </>
          )}
          onConfirm={handleDeleteConfirm}
        />
      )}
      
      {/* THE FIX: Render global toast container */}
      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}