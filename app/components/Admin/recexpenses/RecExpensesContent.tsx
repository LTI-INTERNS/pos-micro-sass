"use client";

import { useState } from "react";
import DateRangePicker from "../common/DateRangeBar";
import SearchBar from "../common/Search-bar";
import FilterPopup from "../common/FilterPopup";
import ActionButton from "../common/ActionButton";
import RecurringExpensesTable, {
  RecurringExpenses,
} from "./RecExpensesTable";
import StatCardGrid from "./RecStatCardGrid";
import AddRecExpensesPopup from "./AddRecExpensesPopup";
import { mockRecurringExpenses } from "./mock";
import { useTableFilters, getFilterOptions } from "../common/Filterlogic";
import FilterChips from "../common/FilterChips";
import { useCSVExport } from "../common/csvExport";


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

      <StatCardGrid />

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
