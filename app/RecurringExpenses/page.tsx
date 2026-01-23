"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/dashboard_layout";
import DateRangePicker from "../components/Dashboard/common/DateRangeBar";
import SearchBar from "../components/Dashboard/common/Search-bar"; 
import ActionButton from "../components/Dashboard/common/ActionButton";
import RecurringExpensesTable, { RecurringExpenses } from "../components/RecurringExpenses/RecExpensesTable";
import StatCardGrid from "../components/RecurringExpenses/RecStatCardGrid";

const sampleRecurringExpenses: RecurringExpenses[] = [
  { id: "001", date: "2025.10.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "002", date: "2025.10.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "003", date: "2025.10.25", category: "Inventory", description: "Cleaning Supplies", payment: "Cash", addedby: "Admin" },
  { id: "004", date: "2025.11.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "005", date: "2025.12.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
];

export default function RecurringExpensesPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState<RecurringExpenses[]>(sampleRecurringExpenses);

  // Filter table whenever search or date range changes
  useEffect(() => {
    let filtered = sampleRecurringExpenses;

    // Filter by search query
    if (search.trim() !== "") {
      const lowerQuery = search.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.id.toLowerCase().includes(lowerQuery) ||
          exp.category.toLowerCase().includes(lowerQuery) ||
          exp.description.toLowerCase().includes(lowerQuery)
      );
    }

    // Filter by date range
    if (start && end) {
      filtered = filtered.filter((exp) => {
        const expDate = new Date(exp.date);
        return expDate >= start && expDate <= end;
      });
    }

    setFilteredExpenses(filtered);
  }, [search, start, end]);

  function exportToCSV(data: RecurringExpenses[], filename = "recurring_expenses.csv") {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) => headers.map((field) => `"${(row as any)[field]}"`).join(",")),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
            onClick={() => console.log("Open add modal")}
          />
          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(filteredExpenses)}
          />
        </div>

        <RecurringExpensesTable RecurringExpenses={filteredExpenses} />
      </div>
    </DashboardLayout>
  );
}
