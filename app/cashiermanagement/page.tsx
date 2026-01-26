"use client";

import { useMemo, useState } from "react";

import DashboardLayout from "../components/Admin/common/dashboard_layout";
import SearchBar from "../components/Admin/common/Search-bar";

import DateRangeBar from "../components/Admin/cashiermanagement/DateRangeBar";
import CashierStatusTabs, {
  type CashierStatus,
} from "../components/Admin/cashiermanagement/CashierStatusTabs";
import CashierActionsBar from "../components/Admin/cashiermanagement/CashierActionsBar";
import CashiersTable, {
  type Cashier,
} from "../components/Admin/cashiermanagement/CashiersTable";

const mockCashiers: Cashier[] = [
  {
    id: "001",
    name: "ABC",
    cashierNo: "1",
    totalRevenue: 85000,
    email: "abc@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "new",
  },
  {
    id: "002",
    name: "John",
    cashierNo: "2",
    totalRevenue: 125000,
    email: "john@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "top",
  },
];

export default function CashierManagementPage() {
  const [status, setStatus] = useState<CashierStatus>("all");
  const [query, setQuery] = useState("");

  const filteredCashiers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockCashiers
      .filter((c) => (status === "all" ? true : c.status === status))
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.cashierNo.toLowerCase().includes(q)
        );
      });
  }, [status, query]);

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
        <DateRangeBar value="Today : Apr 25, 2018 12:00 AM - Apr 26, 2018 12:00 AM" />

        <div className="w-full bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center">
            <div className="flex-1">
              <SearchBar
                placeholder="Search Cashier..."
                value={query}
                onChange={setQuery}
                />
            </div>

            <div className="hidden sm:flex items-center gap-2 pr-4">
              <CashierStatusTabs value={status} onChange={setStatus} />
            </div>
          </div>

          <div className="sm:hidden px-4 pb-3">
            <CashierStatusTabs value={status} onChange={setStatus} />
          </div>
        </div>

        <CashierActionsBar
          onDeactivate={() => alert("Deactivate Cashier")}
          onDelete={() => alert("Delete Cashier")}
          onEdit={() => alert("Edit Cashier")}
          onAdd={() => alert("Add New Cashier")}
          onExport={() => exportCsv(filteredCashiers)}
        />

        <CashiersTable cashiers={filteredCashiers} />
      </div>
    </DashboardLayout>
  );
}