"use client";

import { useState } from "react";
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

type UserRole = "superadmin" | "admin" | "manager";

const mockSession = {
  role: "superadmin" as UserRole,
  name: "John Doe",
  branch: "Colombo",             
};

export default function RecurringExpensesContent() {
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

  const isSuperAdmin = mockSession.role === "superadmin";

  // Superadmin sees all branches; admin/manager sees their branch only
    const branchFilteredRecurringExpenses = isSuperAdmin
      ? mockRecurringExpenses
      : mockRecurringExpenses.filter((e) => e.branch === mockSession.branch);

  const categoryOptions = getFilterOptions(branchFilteredRecurringExpenses, "category");
  const paymentOptions = getFilterOptions(branchFilteredRecurringExpenses, "payment");
  const addedByOptions = getFilterOptions(branchFilteredRecurringExpenses, "addedby");
  const branchOptions = getFilterOptions(mockRecurringExpenses, "branch");

  const filteredRecurringExpenses = useTableFilters<RecurringExpenses>({
      data: branchFilteredRecurringExpenses,
      search,
      start,
      end,
      dateKey: "date",
      searchKeys: ["id", "category", "description"],
      filters,
    });

  const isFilterApplied = Object.values(filters).some(
      (v) => v && v.trim() !== ""
    );

    const removeFilter = (key: string) => {
      setFilters((prev) => ({
        ...prev,
        [key]: "",
      }));
    };
  
  const exportToCSV = useCSVExport<RecurringExpenses>();

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

      <StatCardGrid  recurringexpenses={filteredRecurringExpenses}/>

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
        <FilterChips
          filters={filters}
          onRemove={removeFilter}
        />
        
        <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={(values) => {
              setFilters(values);
              setShowFilter(false);
            }}
            fields={[
              ...(isSuperAdmin
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
                placeholder: "Addedby",
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
          onClick={() => exportToCSV(filteredRecurringExpenses, "RecurringExpenses.csv")}
        />
      </div>

      <RecurringExpensesTable RecurringExpenses={filteredRecurringExpenses} showBranch={isSuperAdmin} />

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
