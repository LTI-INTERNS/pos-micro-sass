"use client";
import { useState } from "react";
import DateRangePicker from "../common/DateRangeBar";
import SearchBar from "../common/Search-bar"; 
import FilterPopup from "../common/FilterPopup";
import ActionButton from "../common/ActionButton";
import ExpensesTable, { Expenses } from "./ExpensesTable";
import StatCardGrid from "./ExpensesStatCardGrid";
import AddExpensesPopup from "./AddExpensesPopup";
import { mockExpenses } from "./mock";
import { useTableFilters, getFilterOptions } from "../common/Filterlogic";
import FilterChips from "../common/FilterChips";
import { useCSVExport } from "../common/csvExport";


export default function ExpensesContent() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);

  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
    addedby?: string;
  }>({});
  
  const categoryOptions = getFilterOptions(mockExpenses, "category");
  const paymentOptions = getFilterOptions(mockExpenses, "payment");
  const addedByOptions = getFilterOptions(mockExpenses, "addedby");

  const filteredExpenses = useTableFilters<Expenses>({
        data: mockExpenses,
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

  const exportCSV = useCSVExport<Expenses>();
  
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
          placeholder="Search Expenses..."
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
      
      <ExpensesTable Expenses={filteredExpenses} />

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