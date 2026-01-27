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
import { useTableFilters, getFilterOptions } from "../components/Admin/common/Filterlogic";
import { useCSVExport } from "../components/Admin/common/csvExport";

export default function ProfitPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
  }>({});

  const categoryOptions = getFilterOptions(mockProfits, "category");
  const paymentOptions = getFilterOptions(mockProfits, "payment");

  const filteredProfits = useTableFilters<Profit>({
    data: mockProfits,
    search,
    start,
    end,
    dateKey: "date",
    searchKeys: ["id", "category", "description"],
    filters,
  });


  const exportToCSV = useCSVExport<Profit>(); 

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
            onClick={() => exportToCSV(filteredProfits, "Profits.csv")}
          />
        </div>
        <ProfitTable profits={filteredProfits} />
      </div>
    </DashboardLayout>
  );
}
