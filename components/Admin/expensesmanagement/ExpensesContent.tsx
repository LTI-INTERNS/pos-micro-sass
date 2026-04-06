"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import ExpensesTable, { Expenses } from "@/components/Admin/expensesmanagement/ExpensesTable";
import StatCardGrid from "@/components/Admin/expensesmanagement/ExpensesStatCardGrid";
import AddExpensesPopup from "@/components/Admin/expensesmanagement/AddExpensesPopup";
import { mockExpenses } from "@/components/Admin/expensesmanagement/mock";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useCSVExport } from "@/components/Admin/common/csvExport";

type UserRole = "owner" | "admin" | "manager";

export default function ExpensesContent() {
  const { data: session, status } = useSession();

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

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

  const branchFilteredExpenses = useMemo(() => {
    if (status === "loading") return [];

    if (isOwner) return mockExpenses;

    if (!branchName) return mockExpenses;

    return mockExpenses.filter(
      (e) => e.branch.trim().toLowerCase() === branchName.toLowerCase()
    );
  }, [status, isOwner, branchName]);

  const visibleFilters = canUseBranchFilter
    ? filters
    : Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "branch")
      );

  const categoryOptions = getFilterOptions(branchFilteredExpenses, "category");
  const paymentOptions = getFilterOptions(branchFilteredExpenses, "payment");
  const addedByOptions = getFilterOptions(branchFilteredExpenses, "addedby");
  const branchOptions = getFilterOptions(mockExpenses, "branch");

  const filteredExpenses = useTableFilters<Expenses>({
    data: branchFilteredExpenses,
    search,
    start,
    end,
    dateKey: "date",
    searchKeys: ["id", "category", "description"],
    filters: canUseBranchFilter ? filters : { ...filters, branch: "" },
  });

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

  if (status === "loading") {
    return <div className="w-full p-4">Loading expenses...</div>;
  }

  return (
    <div className="w-full space-y-5">
      <DateRangePicker
        startDate={start}
        endDate={end}
        onChange={(s, e) => {
          setStart(s);
          setEnd(e);
        }}
      />

      <StatCardGrid expenses={filteredExpenses} />

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

      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          label="Add Expense"
          variant="primary"
          onClick={() => setShowAddExpense(true)}
        />
        <ActionButton
          label="Export CSV"
          variant="primary"
          onClick={() => exportCSV(filteredExpenses, "Expenses.csv")}
        />
      </div>

      <ExpensesTable
        Expenses={filteredExpenses}
        showBranch={showBranchColumn}
      />

      <AddExpensesPopup
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={(values) => {
          console.log("Saved expense:", values);
          setShowAddExpense(false);
        }}
      />
    </div>
  );
}