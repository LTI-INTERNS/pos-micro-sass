"use client";
import { useState } from "react";
import DashboardLayout from "../components/dashboard_layout";
import DateRangeBar from "../components/DateRangeBar";
import SearchBar from "../components/Dashboard/common/Search-bar"; 
import ActionButton from "../components/Dashboard/common/ActionButton";
import ProfitTable, {Profit} from "../components/ProfitCalculation/ProfitTable";
import StatCardGrid from "../components/ProfitCalculation/ProfitStatCardGrid";

const sampleProfits: Profit[] = [
  {
    id: "001",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
  },
  {
    id: "002",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
  },
  {
    id: "003",
    date: "2025.10.25",
    category: "Inventory",
    description: "Cleaning Supplies",
    profit: "4500.00",
    payment: "Cash",
  },
  {
    id: "004",
    date: "2025.11.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
  },
  {
    id: "005",
    date: "2025.12.25",
    category: "Inventory",
    description: "Cleaning Supply",
    profit: "4500.00",
    payment: "Cash",
  },
];

export default function ProfitPage() {
  const [search, setSearch] = useState("");
  const [filteredProfits, setFilteredProducts] = useState<Profit[]>(sampleProfits);

  function handleSearch(query: string) {
    setSearch(query);

    const lowerQuery = query.toLowerCase();
    const filtered = sampleProfits.filter(
      (profit) =>
        profit.id.toLowerCase().includes(lowerQuery) ||
        profit.category.toLowerCase().includes(lowerQuery) ||
        profit.description.toLowerCase().includes(lowerQuery)
    );
    setFilteredProducts(filtered);
  }

  function exportToCSV(data: Profit[], filename = "profit_data.csv") {
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
      <div className="w-full space-y-6">
        <DateRangeBar/>
        <StatCardGrid />
        <SearchBar
          value={search}
          onChange={handleSearch}
          placeholder="Search Profits..."
          debounceMs={300}
          showClear
          showFilter
          onFilter={() => console.log("Open filter modal")}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full sm:w-[700px]">
          <ActionButton
            label="Export CSV"
            variant="primary"
            onClick={() => exportToCSV(filteredProfits)}
          />
        </div>
        <ProfitTable profits={filteredProfits} />
      </div>
    </DashboardLayout>
  );
}
