"use client";

import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangePicker from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import FilterPopup from "../components/Admin/common/FilterPopup";
import ActionButton from "../components/Admin/common/ActionButton";
import RecurringExpensesTable, {
  RecurringExpenses,
} from "../components/Admin/recexpenses/RecExpensesTable";
import StatCardGrid from "../components/Admin/recexpenses/RecStatCardGrid";
import AddRecExpensesPopup from "../components/Admin/recexpenses/AddRecExpensesPopup";
import { mockRecurringExpenses } from "../components/Admin/recexpenses/mock";
import { useTableFilters, getFilterOptions } from "../components/Admin/common/Filterlogic";
import { useCSVExport } from "../components/Admin/common/csvExport";


export default function RecurringExpensesPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddRecExpense, setShowAddRecExpense] = useState(false);
  
  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
    addedby?: string;
  }>({});

  const categoryOptions = getFilterOptions(mockRecurringExpenses, "category");
  const paymentOptions = getFilterOptions(mockRecurringExpenses, "payment");
  const addedByOptions = getFilterOptions(mockRecurringExpenses, "addedby");

  const filteredExpenses = useTableFilters<RecurringExpenses>({
      data: mockRecurringExpenses,
      search,
      start,
      end,
      dateKey: "date",
      searchKeys: ["id", "category", "description"],
      filters,
    });
  
  const exportToCSV = useCSVExport<RecurringExpenses>();

  return (
    <DashboardLayout>
      <div className="w-full space-y-5">
        <DateRangePicker
          startDate={start}
          endDate={end}
          onChange={(s, e) => {
            setStart(s);
            setEnd(e);
          }}
        />

        <StatCardGrid />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Recurring Expenses..."
            debounceMs={300}
            showFilter
            onFilter={() => setShowFilter((v) => !v)}
          />
          <FilterPopup
              open={showFilter}
              onClose={() => setShowFilter(false)}
              onApply={(values) => {
                setFilters(values);
                setShowFilter(false);
              }}
              fields={[
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
            onClick={() => exportToCSV(filteredExpenses, "RecurringExpenses.csv")}
          />
        </div>

        <RecurringExpensesTable RecurringExpenses={filteredExpenses} />
      </div>

      <AddRecExpensesPopup
          open={showAddRecExpense}
          onClose={() => setShowAddRecExpense(false)}
          onSave={(values) => {
            console.log("Saved Rec expense:", values);
            setShowAddRecExpense(false);
            // later: update expenses state or API call
          }}
        />

    </DashboardLayout>
  );
}
