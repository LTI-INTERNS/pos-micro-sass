"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangePicker from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import ActionButton from "../components/Admin/common/ActionButton";
import RecurringExpensesTable, {
  RecurringExpenses,
} from "../components/Admin/recexpenses/RecExpensesTable";
import StatCardGrid from "../components/Admin/recexpenses/RecStatCardGrid";
import AddRecExpensesPopup from "../components/Admin/recexpenses/AddRecExpensesPopup";
import { mockRecurringExpenses } from "../components/Admin/recexpenses/mock";
import AddExpensesPopup from "../components/Admin/expensesmanagement/AddExpensesPopup";

export default function RecurringExpensesPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [filteredExpenses, setFilteredExpenses] =
    useState<RecurringExpenses[]>(mockRecurringExpenses);
  const [showAddRecExpense, setShowAddRecExpense] = useState(false);

  useEffect(() => {
    let filtered = mockRecurringExpenses;

    // Search filter
    if (search.trim() !== "") {
      const lowerQuery = search.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.id.toLowerCase().includes(lowerQuery) ||
          exp.category.toLowerCase().includes(lowerQuery) ||
          exp.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Date range filter
    if (start && end) {
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= start && expDate <= end;
      });
    }

    setFilteredExpenses(filtered);
  }, [search, start, end]);

  function exportToCSV(
    data: RecurringExpenses[],
    filename = "recurring_expenses.csv"
  ) {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => `"${(row as any)[field]}"`).join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute("download", filename);
    link.click();
    URL.revokeObjectURL(url);
  }

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

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Recurring Expenses..."
          debounceMs={300}
          showClear
          showFilter
          onFilter={() => console.log("Open filter modal")}
        />

        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            label="Add Recurring Expense"
            variant="primary"
            onClick={() => setShowAddRecExpense(true)}
          />
          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(filteredExpenses)}
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
