"use client";

import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangePicker from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import FilterPopup from "../components/Admin/common/FilterPopup"; 
import ActionButton from "../components/Admin/common/ActionButton";
import ProfitTable, {Profit} from "../components/Admin/profitcalculation/ProfitTable";
import StatCardGrid from "../components/Admin/profitcalculation/ProfitStatCardGrid";
import { mockProfits } from "../components/Admin/profitcalculation/mock";
import { useTableFilters } from "../components/Admin/common/Filterlogic";

export default function ProfitPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
  }>({});

  const categoryOptions = getUniqueOptions(mockProfits, "category");
  const paymentOptions = getUniqueOptions(mockProfits, "payment");

  const filteredProfits = useTableFilters<Profit>({
    data: mockProfits,
    search,
    start,
    end,
    dateKey: "date",
    searchKeys: ["id", "category", "description"],
    filters,
  });


  function exportToCSV(data: Profit[], filename = "profit_data.csv") {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((field) => `"${(row as any)[field]}"`).join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
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
        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Profits..."
            debounceMs={300}
            showClear
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
              ]}
            />
          </div>


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
