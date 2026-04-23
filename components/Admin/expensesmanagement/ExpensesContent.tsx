"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import ExpensesTable, {
  Expenses,
} from "@/components/Admin/expensesmanagement/ExpensesTable";
import StatCardGrid from "@/components/Admin/expensesmanagement/ExpensesStatCardGrid";
import AddExpensesPopup from "@/components/Admin/expensesmanagement/AddExpensesPopup";
import {
  BranchItem,
  expenseApi,
  ExpenseApiItem,
  ExpenseCategoryItem,
} from "@/lib/api/expenses";
import {
  useTableFilters,
  getFilterOptions,
} from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useCSVExport } from "@/components/Admin/common/csvExport";

type UserRole = "owner" | "admin" | "manager";

const normalizeExpense = (item: ExpenseApiItem): Expenses => ({
  id: item.expensesId,
  expenseId: item.expensesId,
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

export default function ExpensesContent() {
  const { data: session, status } = useSession();

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showExpensePopup, setShowExpensePopup] = useState(false);

  const [expenses, setExpenses] = useState<Expenses[]>([]);
  const [categories, setCategories] = useState<ExpenseCategoryItem[]>([]);
  const [branches, setBranches] = useState<BranchItem[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expenses | null>(null);
  const [selectedExpense, setSelectedExpense] = useState<Expenses | null>(null);

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

  const fetchAll = async () => {
    if (!session) return;

    try {
      setPageLoading(true);

      const [expenseRows, categoryRows, branchRows] = await Promise.all([
        expenseApi.getExpenses(session),
        expenseApi.getExpenseCategories(session),
        expenseApi.getBranches(session).catch(() => []),
      ]);

      const normalizedExpenses = expenseRows.map(normalizeExpense);

      setExpenses(normalizedExpenses);
      setCategories(categoryRows);
      setBranches(branchRows);

      setSelectedExpense((prev) => {
        if (!prev) return null;
        return (
          normalizedExpenses.find((item) => item.expenseId === prev.expenseId) ??
          null
        );
      });
    } catch (error: any) {
      console.error("Failed to load expenses:", error);
      alert(
        error?.response?.data?.error?.message ||
          "Failed to load expense data."
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") {
      void fetchAll();
    }
  }, [status]);

  const branchFilteredExpenses = useMemo(() => {
    if (status === "loading") return [];

    if (isOwner || isAdmin) return expenses;

    if (!branchName) return expenses;

    return expenses.filter(
      (e) => e.branch.trim().toLowerCase() === branchName.toLowerCase()
    );
  }, [status, isOwner, isAdmin, branchName, expenses]);

  const visibleFilters = canUseBranchFilter
    ? filters
    : Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "branch")
      );

  const categoryOptions = getFilterOptions(branchFilteredExpenses, "category");
  const paymentOptions = getFilterOptions(branchFilteredExpenses, "payment");
  const addedByOptions = getFilterOptions(branchFilteredExpenses, "addedby");
  const branchOptions = getFilterOptions(expenses, "branch");

  const filteredExpenses = useTableFilters<Expenses>({
    data: branchFilteredExpenses,
    search,
    start,
    end,
    dateKey: "date",
    searchKeys: ["id", "category", "description"],
    filters: canUseBranchFilter ? filters : { ...filters, branch: "" },
  });

  useEffect(() => {
    if (!selectedExpense) return;

    const stillExists = filteredExpenses.find(
      (item) => item.expenseId === selectedExpense.expenseId
    );

    if (!stillExists) {
      setSelectedExpense(null);
    }
  }, [filteredExpenses, selectedExpense]);

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

  const exportCSV = useCSVExport<Expenses>();

  const resetPopupState = () => {
    setShowExpensePopup(false);
    setEditingExpense(null);
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
      await expenseApi.createExpense(session, values);
      await fetchAll();
      resetPopupState();
    } catch (error: any) {
      console.error("Create expense failed:", error);
      alert(
        error?.response?.data?.error?.message ||
          "Failed to create expense."
      );
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
    if (!editingExpense) return;

    try {
      setSaveLoading(true);
      await expenseApi.updateExpense(session, editingExpense.expenseId, values);
      await fetchAll();
      resetPopupState();
    } catch (error: any) {
      console.error("Update expense failed:", error);
      alert(
        error?.response?.data?.error?.message ||
          "Failed to update expense."
      );
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpense) {
      alert("Please select an expense first.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${selectedExpense.description}"?`
    );
    if (!confirmed) return;

    try {
      await expenseApi.deleteExpense(session, selectedExpense.expenseId);
      setSelectedExpense(null);
      await fetchAll();
    } catch (error: any) {
      console.error("Delete expense failed:", error);
      alert(
        error?.response?.data?.error?.message ||
          "Failed to delete expense."
      );
    }
  };

  const isLoading = status === "loading";

  return (
    <div className="w-full space-y-5">
      

      <StatCardGrid expenses={filteredExpenses} />

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
          placeholder="Search Expenses..."
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
          label="Add Expense"
          variant="primary"
          onClick={() => {
            setEditingExpense(null);
            setShowExpensePopup(true);
          }}
        />

        <ActionButton
          label="Edit Expense"
          variant="outline"
          onClick={() => {
            if (!selectedExpense) {
              alert("Please select an expense first.");
              return;
            }

            setEditingExpense(selectedExpense);
            setShowExpensePopup(true);
          }}
        />

        <ActionButton
          label="Delete Expense"
          variant="outline"
          onClick={handleDelete}
        />

        <ActionButton
          label="Export CSV"
          variant="primary"
          onClick={() => exportCSV(filteredExpenses, "Expenses.csv")}
        />
      </div>

      {isLoading ? (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-500">
            Loading table data...
          </div>
        ) : (
          <ExpensesTable
            Expenses={filteredExpenses}
            showBranch={showBranchColumn}
            selectedExpenseId={selectedExpense?.id }
            onSelectExpense={setSelectedExpense}
          />
        )}

      <AddExpensesPopup
        open={showExpensePopup}
        onClose={resetPopupState}
        onSave={editingExpense ? handleUpdate : handleCreate}
        categories={categories}
        branches={branches}
        loading={saveLoading}
        mode={editingExpense ? "edit" : "create"}
        initialValues={
          editingExpense
            ? {
                expensesId: editingExpense.expenseId,
                date: editingExpense.date,
                categoryId: editingExpense.categoryId,
                description: editingExpense.description,
                amount: editingExpense.amount,
                paymentType: editingExpense.paymentType,
                branchId: editingExpense.branchId,
              }
            : null
        }
      />
    </div>
  );
}