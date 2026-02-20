"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import SearchBar from "../components/Admin/common/Search-bar";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import FilterPopup, {type SelectField,} from "../components/Admin/common/FilterPopup";
import CashierActionsBar from "../components/Admin/cashiermanagement/CashierActionsBar";
import CashiersTable, {type Cashier,} from "../components/Admin/cashiermanagement/CashiersTable";
import { AddCashierForm } from "../components/Admin/cashiermanagement/AddCashierForm";
import FilterChips from "@/app/components/Admin/common/FilterChips";
import DeactivateCashierPopup from "../components/Admin/cashiermanagement/DeactivateCashierPopup";
import DeletePopup from "../components/Admin/common/Deletepopup"
import EditEntityModal, {EditField} from "@/app/components/Admin/common/EditPopup";

const mockCashiers: Cashier[] = [
  {
    id: "001",
    name: "ABC",
    cashierNo: "1",
    totalRevenue: 85000,
    email: "abc@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "Active"
  },
  {
    id: "002",
    name: "John",
    cashierNo: "2",
    totalRevenue: 125000,
    email: "john@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "Deactive"
  },
];

export default function CashierManagementPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [deactivatePopupOpen, setDeactivatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);


  const [filters, setFilters] = useState<Record<string, string>>({
    cashierNo: "",
    revenueRange: "",
    status: "",
  });

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
      {
        name: "status",
        placeholder: "Select Status",
        options: [
          { label: "Active", value: "Active" },
          { label: "Deactive", value: "Deactive" },
        ],
      }
    ];
  }, []);

  const filteredCashiers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return mockCashiers
      
      .filter((c) => {
        if (!q) return true;
        return (
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.cashierNo.toLowerCase().includes(q)
        );
      })
      
      .filter((c) => {
       
        if (filters.cashierNo && c.cashierNo !== filters.cashierNo) return false;

       
        if (filters.revenueRange === "lt100k" && c.totalRevenue >= 100000)
          return false;
        if (filters.revenueRange === "gte100k" && c.totalRevenue < 100000)
          return false;

        if (filters.status && c.status !== filters.status) return false;

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
      "status",
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
          r.status,
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

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const editFields: EditField[] = [
    { name: "name", label: "Name" },
    { name: "cashierNo", label: "Cashier No" },
    { name: "email", label: "Email" },
  ];

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangeBar />

        <div className="relative w-full">
          <SearchBar
            placeholder="Search Cashier..."
            value={query}
            onChange={setQuery}
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />

          <FilterChips
            filters={filters}
            onRemove={removeFilter}
          />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => setFilters(values)}
          />
        </div>

        <CashierActionsBar
         onDeactivate={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setDeactivatePopupOpen(true);
          }}
          onDelete={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setDeletePopupOpen(true);
          }}
          onEdit={() => {
            if (!selectedCashier) {
              alert("Please select a cashier first!");
              return;
            }
            setEditPopupOpen(true);
          }}

          onAdd={() => setAddOpen(true)} // opens AddCashierForm popup
          onExport={() => exportCsv(filteredCashiers)}
        />

        <CashiersTable
          cashiers={filteredCashiers}
          selectedRowId={selectedCashier?.id}
          onSelectRow={(row) => setSelectedCashier(row)}
        />

        <AddCashierForm
          isOpen={addOpen}
          onClose={() => setAddOpen(false)}
        />

        <DeactivateCashierPopup
          isOpen={deactivatePopupOpen}
          onClose={() => setDeactivatePopupOpen(false)}
          cashier={selectedCashier ?? undefined}
          onConfirm={() => {
            if (!selectedCashier) return;

            const updatedStatus = selectedCashier.status === "Active" ? "Deactive" : "Active";

            // update mockCashiers state or call API
            mockCashiers.forEach((c) => {
              if (c.id === selectedCashier.id) c.status = updatedStatus;
            });

            setSelectedCashier({ ...selectedCashier, status: updatedStatus });
            setDeactivatePopupOpen(false);
          }}
        />

        {selectedCashier && (
          <DeletePopup
            isOpen={deletePopupOpen}
            onClose={() => setDeletePopupOpen(false)}
            item={selectedCashier}
            itemName="Cashier"
            getDisplayText={(c) => (
            <><br /><br />
              ID - {c.id}<br />
              Cashier Name- {c.name}
            </>
            )}
            onConfirm={() => {
              const index = mockCashiers.findIndex(c => c.id === selectedCashier.id);
              if (index >= 0) mockCashiers.splice(index, 1);
              setSelectedCashier(null);
              setDeletePopupOpen(false);
            }}
          />
        )}

        {selectedCashier && editPopupOpen && (
          <EditEntityModal<Cashier>
            open={editPopupOpen}
            title="Edit Cashier"
            initialValues={selectedCashier}
            fields={editFields}
            onClose={() => setEditPopupOpen(false)}
            onSave={(updatedCashier) => {
              // Update mockCashiers array
              const index = mockCashiers.findIndex(c => c.id === selectedCashier.id);
              if (index >= 0) {
                mockCashiers[index] = updatedCashier;
              }

              setSelectedCashier(updatedCashier);
              setEditPopupOpen(false);
            }}
          />
        )}


      </div>
    </DashboardLayout>
  );
}