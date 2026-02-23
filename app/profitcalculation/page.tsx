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
import FilterChips from "../components/Admin/common/FilterChips";
import { useCSVExport } from "../components/Admin/common/csvExport";

type UserRole = "superadmin" | "admin" | "manager";

const mockSession = {
  role: "superadmin" as UserRole,
  name: "John Doe",
  branch: "Colombo",             
};

export default function ProfitPage() {
  const [start, setStart] = useState<Date | undefined>();
  const [end, setEnd] = useState<Date | undefined>();
  const [search, setSearch] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  const [filters, setFilters] = useState<{
    category?: string;
    payment?: string;
    branch?: string;
  }>({});

  const isSuperAdmin = mockSession.role === "superadmin";
  
  const branchFilteredProfits = isSuperAdmin
    ? mockProfits
    : mockProfits.filter((e) => e.branch === mockSession.branch);

  const categoryOptions = getFilterOptions(branchFilteredProfits, "category");
  const paymentOptions = getFilterOptions(branchFilteredProfits, "payment");
  const branchOptions = getFilterOptions(mockProfits, "branch");

  const filteredProfits = useTableFilters<Profit>({
    data: branchFilteredProfits,
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

        <StatCardGrid profits={filteredProfits}/>
        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Profits..."
            debounceMs={300}
            showClear
            showFilter
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
                ...(isSuperAdmin
              ? [{ name: "branch", placeholder: "Branch", options: branchOptions }]
              : []),
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
        <ProfitTable profits={filteredProfits} showBranch={isSuperAdmin}/>
      </div>
    </DashboardLayout>
  );
}
