"use client";

import { useMemo, useState } from "react";

import DashboardLayout from "../components/Admin/common/dashboard_layout";
import SearchBar from "../components/Admin/common/Search-bar";
import DateRangeBar from "../components/Admin/common/DateRangeBar";

import FilterPopup, {
  type SelectField,
} from "../components/Admin/common/FilterPopup";

import CashierActionsBar from "../components/Admin/cashiermanagement/CashierActionsBar";
import CashiersTable, {
  type Cashier,
} from "../components/Admin/cashiermanagement/CashiersTable";

// ✅ IMPORTANT: AddCashierForm is a NAMED export
import { AddCashierForm } from "../components/Admin/cashiermanagement/AddCashierForm";
import FilterChips from "../components/Admin/common/FilterChips";

const mockCashiers: Cashier[] = [
  {
    id: "001",
    name: "ABC",
    cashierNo: "1",
    totalRevenue: 85000,
    email: "abc@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
  },
  {
    id: "002",
    name: "John",
    cashierNo: "2",
    totalRevenue: 125000,
    email: "john@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
  },
];

export default function CashierManagementPage() {
  const [query, setQuery] = useState("");

  // Filter popup open/close
  const [filterOpen, setFilterOpen] = useState(false);

  // Add cashier popup open/close
  const [addOpen, setAddOpen] = useState(false);

  // Selected filter values
  const [filters, setFilters] = useState<Record<string, string>>({
    cashierNo: "",
    revenueRange: "",
  });
      const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const handleRemoveFilter = (key: string) => {
    setFilters((prev) => ({ ...prev, [key]: "" }));
  };

  const clearAllFilters = () => {
    setFilters({});
  };

  // Filter dropdown fields shown in popup
  const filterFields: SelectField[] = useMemo(() => {
    const uniqueCashierNos = Array.from(
      new Set(mockCashiers.map((c) => c.cashierNo))
    );

    return [
      {
        name: "cashierNo",
        placeholder: "Select Cashier No",
        options: uniqueCashierNos.map((no) => ({ label: no, value: no })),
      },
      {
        name: "revenueRange",
        placeholder: "Select Revenue Range",
        options: [
          { label: "Below 100,000", value: "lt100k" },
          { label: "100,000 and Above", value: "gte100k" },
        ],
      },
    ];
  }, []);

  const filteredCashiers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockCashiers
      // ✅ Search text filtering
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.cashierNo.toLowerCase().includes(q)
        );
      })
      // ✅ Popup dropdown filtering
      .filter((c) => {
        // Cashier No filter
        if (filters.cashierNo && c.cashierNo !== filters.cashierNo) return false;

        // Revenue Range filter
        if (filters.revenueRange === "lt100k" && c.totalRevenue >= 100000)
          return false;
        if (filters.revenueRange === "gte100k" && c.totalRevenue < 100000)
          return false;

        return true;
      });
  }, [query, filters]);

  function exportCsv(rows: Cashier[]) {
    const header = [
      "ID",
      "Name",
      "Cashier No",
      "Total Revenue",
      "Email",
      "Password",
      "Pin",
    ];

    const csvRows = [
      header.join(","),
      ...rows.map((r) =>
        [
          r.id,
          r.name,
          r.cashierNo,
          r.totalRevenue,
          r.email,
          r.passwordMasked,
          r.pinMasked,
        ]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
          .join(",")
      ),
    ];

    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cashiers.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangeBar />

        {/* Search + Filter (FilterPopup positioned relative to this wrapper) */}
        <div className="relative w-full">
          <SearchBar
            placeholder="Search Cashier..."
            value={query}
            onChange={setQuery}
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={clearAllFilters}
          />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => setFilters(values)}
          />
        </div>

        <FilterChips filters={filters} onRemove={handleRemoveFilter} />

        <CashierActionsBar
          onDeactivate={() => alert("Deactivate Cashier")}
          onDelete={() => alert("Delete Cashier")}
          onEdit={() => alert("Edit Cashier")}
          onAdd={() => setAddOpen(true)} // ✅ opens AddCashierForm popup
          onExport={() => exportCsv(filteredCashiers)}
        />

        <CashiersTable cashiers={filteredCashiers} />

        {/* ✅ Add Cashier Popup */}
        <AddCashierForm
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}