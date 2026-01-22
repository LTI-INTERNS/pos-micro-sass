"use client";
import { useState } from "react";
import DashboardLayout from "../components/dashboard_layout";
import DateRangeBar from "../components/DateRangeBar";
import SearchBar from "../components/Dashboard/common/Search-bar"; 
import ActionButton from "../components/Dashboard/common/ActionButton";
import ExpensesTable, { Expenses } from "../components/ExpensesManagement/ExpensesTable";
import StatCardGrid from "../components/ExpensesManagement/ExpensesStatCardGrid";

const sampleExpenses: Expenses[] = [
  { id: "001", date: "2025.10.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "002", date: "2025.10.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "004", date: "2025.11.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
  { id: "005", date: "2025.12.25", category: "Inventory", description: "Cleaning Supply", payment: "Cash", addedby: "Admin" },
];

export default function ExpensesPage() {
  const [search, setSearch] = useState("");
  const [filteredExpenses, setFilteredExpenses] = useState<Expenses[]>(sampleExpenses);

  function handleSearch(query: string) {
    setSearch(query);

    const lowerQuery = query.toLowerCase();
    const filtered = sampleExpenses.filter(
      (exp) =>
        exp.id.toLowerCase().includes(lowerQuery) ||
        exp.category.toLowerCase().includes(lowerQuery) ||
        exp.description.toLowerCase().includes(lowerQuery)
    );
    setFilteredExpenses(filtered);
  }

  function exportToCSV(data: Expenses[], filename = "Expenses.csv") {
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
        <DateRangeBar />
        <StatCardGrid />
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search Expenses..."
          debounceMs={300}
          showClear
          showFilter
          onFilter={() => console.log("Open filter modal")}
        />

        <div className="grid grid-cols-2 gap-3">
          <ActionButton
            label="Add Expense"
            variant="primary"
            onClick={() => console.log("Open add modal")}
          />

          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(filteredExpenses)}
          />
        </div>
        <ExpensesTable Expenses={filteredExpenses} />
      </div>
    </DashboardLayout>
  );
}
