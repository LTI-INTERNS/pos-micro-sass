"use client";

import { useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DateRangePicker from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import RecurringExpensesTable, {
  RecurringExpenses,
} from "@/components/Admin/recexpenses/RecExpensesTable";
import StatCardGrid from "@/components/Admin/recexpenses/RecStatCardGrid";
import AddRecExpensesPopup from "@/components/Admin/recexpenses/AddRecExpensesPopup";
import { mockRecurringExpenses } from "@/components/Admin/recexpenses/mock";
import { useTableFilters, getFilterOptions } from "@/components/Admin/common/Filterlogic";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useCSVExport } from "@/components/Admin/common/csvExport";

type UserRole = "owner" | "admin" | "manager";

export default function RecurringExpensesContent() {
  const { data: session, status } = useSession();

  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddRecExpense, setShowAddRecExpense] = useState(false);

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

  const branchFilteredRecurringExpenses = useMemo(() => {
    if (status === "loading") return [];

    if (isOwner) return mockRecurringExpenses;

    if (!branchName) return mockRecurringExpenses;

    return mockRecurringExpenses.filter(
      (e) => e.branch.trim().toLowerCase() === branchName.toLowerCase()
    );
  }, [status, isOwner, branchName]);

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
  const branchOptions = getFilterOptions(mockRecurringExpenses, "branch");

  const filteredRecurringExpenses = useTableFilters<RecurringExpenses>({
    data: branchFilteredRecurringExpenses,
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

  const exportToCSV = useCSVExport<RecurringExpenses>();

  if (status === "loading") {
    return <div className="w-full p-4">Loading recurring expenses...</div>;
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

      <StatCardGrid recurringexpenses={filteredRecurringExpenses} />

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
            {
              name: "category",
              placeholder: "Category",
              options: categoryOptions,
            },
            {
              name: "payment",
              placeholder: "Payment",
              options: paymentOptions,
            },
            {
              name: "addedby",
              placeholder: "Added By",
              options: addedByOptions,
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ActionButton
          label="Add Recurring Expense"
          variant="primary"
          onClick={() => setShowAddRecExpense(true)}
        />
        <ActionButton
          label="Export CSV"
          variant="primary"
          onClick={() =>
            exportToCSV(filteredRecurringExpenses, "RecurringExpenses.csv")
          }
        />
      </div>

      <RecurringExpensesTable
        RecurringExpenses={filteredRecurringExpenses}
        showBranch={showBranchColumn}
      />

      <AddRecExpensesPopup
        open={showAddRecExpense}
        onClose={() => setShowAddRecExpense(false)}
        onSave={(values) => {
          console.log("Saved Rec expense:", values);
          setShowAddRecExpense(false);
        }}
      />
    </div>
  );
}