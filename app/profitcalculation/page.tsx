"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../Admin/components/common/dashboard_layout";
import DateRangePicker from "../Admin/components/common/DateRangeBar";
import SearchBar from "../Admin/components/common/Search-bar"; 
import ActionButton from "../Admin/components/common/ActionButton";
import ProfitTable, {Profit} from "../Admin/components/profitcalculation/ProfitTable";
import StatCardGrid from "../Admin/components/profitcalculation/ProfitStatCardGrid";

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
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [filteredProfits, setFilteredProducts] = useState<Profit[]>(sampleProfits);

  useEffect(() => {
    let filtered = sampleProfits;

    if (search.trim() !== "") {
      const lowerQuery = search.toLowerCase();
      filtered = filtered.filter(
        (profit) =>
          profit.id.toLowerCase().includes(lowerQuery) ||
          profit.category.toLowerCase().includes(lowerQuery) ||
          profit.description.toLowerCase().includes(lowerQuery)
      );
    }

    if (start && end) {
      filtered = filtered.filter((profit) => {
        const profitDate = new Date(profit.date);
        return profitDate >= start && profitDate <= end;
      });
    }

    setFilteredProducts(filtered);
  }, [search, start, end]);


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
