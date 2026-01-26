"use client";
import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangePicker from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar"; 
import FilterPopup from "../components/Admin/common/FilterPopup";
import ActionButton from "../components/Admin/common/ActionButton";
import ExpensesTable, { Expenses } from "../components/Admin/expensesmanagement/ExpensesTable";
import StatCardGrid from "../components/Admin/expensesmanagement/ExpensesStatCardGrid";
import AddExpensesPopup from "../components/Admin/expensesmanagement/AddExpensesPopup";
import { mockExpenses } from "../components/Admin/expensesmanagement/mock";
import { useTableFilters } from "../components/Admin/common/Filterlogic";

export default function ExpensesPage() {
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
  
  const categoryOptions = getUniqueOptions(mockExpenses, "category");
  const paymentOptions = getUniqueOptions(mockExpenses, "payment");
  const addedByOptions = getUniqueOptions(mockExpenses, "addedby");
  
  

  const filteredExpenses = useTableFilters<Expenses>({
        data: mockExpenses,
        search,
        start,
        end,
        dateKey: "date",
        searchKeys: ["id", "category", "description"],
        filters,
      });


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

  function getUniqueOptions<T, K extends keyof T>(
    data: T[],
    key: K
  ) {
    return Array.from(new Set(data.map((item) => item[key])))
      .filter(Boolean)
      .map((value) => ({
        label: String(value),
        value: String(value),
      }));
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

       <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Expenses..."
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
            label="Add Expense"
            variant="primary"
            onClick={() => setShowAddExpense(true)}
          />

          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(filteredExpenses)}
          />
        </div> 
        <ExpensesTable Expenses={filteredExpenses} />
      </div>

      <AddExpensesPopup
        open={showAddExpense}
        onClose={() => setShowAddExpense(false)}
        onSave={(values) => {
          console.log("Saved expense:", values);
          setShowAddExpense(false);
          // later: update expenses state or API call
        }}
      />
      

    </DashboardLayout>
  );
}
