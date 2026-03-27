"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import DateRangeBar from "@/components/Admin/common/DateRangeBar";
import FilterPopup, { type SelectField } from "@/components/Admin/common/FilterPopup";
import CashierActionsBar from "@/components/Admin/cashiermanagement/CashierActionsBar";
import CashiersTable, { type Cashier } from "@/components/Admin/cashiermanagement/CashiersTable";
import { AddCashierForm } from "@/components/Admin/cashiermanagement/AddCashierForm";
import FilterChips from "@/components/Admin/common/FilterChips";
import DeactivateCashierPopup from "@/components/Admin/cashiermanagement/DeactivateCashierPopup";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";

type UserRole = "superadmin" | "admin" | "manager";

const mockCashiers: Cashier[] = [
  {
    id: "001",
    name: "ABC",
    cashierNo: "1",
    totalRevenue: 85000,
    email: "abc@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "Active",
    // ✅ add a branch field in your real data model
    branch: "Negombo",
  } as Cashier & { branch?: string },
  {
    id: "002",
    name: "John",
    cashierNo: "2",
    totalRevenue: 125000,
    email: "john@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "Deactive",
    branch: "Colombo",
  } as Cashier & { branch?: string },
    {
    id: "003",
    name: "XYZ",
    cashierNo: "3",
    totalRevenue: 95000,
    email: "xyz@email.com",
    passwordMasked: "*****",
    pinMasked: "****",
    status: "Active",
    // ✅ add a branch field in your real data model
    branch: "Nugegoda",
  } as Cashier & { branch?: string },
];

export default function CashierManagementPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [selectedCashier, setSelectedCashier] = useState<Cashier | null>(null);
  const [deactivatePopupOpen, setDeactivatePopupOpen] = useState(false);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  // ✅ TODO: Replace with actual auth session/role + branch
  const userRole: UserRole = "admin" as UserRole;
  const userBranch = "Negombo" as const; // Get from auth context/session

  const [filters, setFilters] = useState<Record<string, string>>({
    cashierNo: "",
    revenueRange: "",
    status: "",
    branch: "",
  });

  // ✅ Base data: superadmin sees all; admin/manager only their branch
  const baseData = useMemo(() => {
    const all = mockCashiers as (Cashier & { branch?: string })[];
    return userRole === "superadmin"
      ? all
      : all.filter((c) => (c.branch ?? "") === userBranch);
  }, [userRole, userBranch]);

  // ✅ Clear any leftover branch filter if user isn't allowed to use it
  useEffect(() => {
    if (userRole !== "superadmin") {
      setFilters((prev) => ({ ...prev, branch: "" }));
    }
  }, [userRole]);

  const filterFields: SelectField[] = useMemo(() => {
    const uniqueCashierNos = Array.from(new Set(baseData.map((c) => c.cashierNo)));

    const branchOptions =
      userRole === "superadmin"
        ? Array.from(new Set((mockCashiers as (Cashier & { branch?: string })[]).map((c) => c.branch ?? "")))
            .filter(Boolean)
            .map((b) => ({ label: b, value: b }))
        : [];

    return [
      // ✅ Branch filter only for superadmin
      ...(userRole === "superadmin"
        ? [
            {
              name: "branch",
              placeholder: "Select Branch",
              options: branchOptions,
            } as SelectField,
          ]
        : []),

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
      },
    ];
  }, [baseData, userRole]);

  const filteredCashiers = useMemo(() => {
    const q = query.trim().toLowerCase();

    return baseData
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

        if (filters.revenueRange === "lt100k" && c.totalRevenue >= 100000) return false;
        if (filters.revenueRange === "gte100k" && c.totalRevenue < 100000) return false;

        if (filters.status && c.status !== filters.status) return false;

        // ✅ Branch filter only matters for superadmin
        if (userRole === "superadmin") {
          const branch = (c as Cashier & { branch?: string }).branch ?? "";
          if (filters.branch && branch !== filters.branch) return false;
        }

        return true;
      });
  }, [query, filters, baseData, userRole]);

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

  const isFilterApplied = Object.values(filters).some((v) => v && v.trim() !== "");

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
        

        <div className="relative w-full">
          <SearchBar
            placeholder="Search Cashier..."
            value={query}
            onChange={setQuery}
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({ cashierNo: "", revenueRange: "", status: "", branch: "" })}
          />

          <FilterChips filters={filters} onRemove={removeFilter} />

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
          onAdd={() => setAddOpen(true)}
          onExport={() => exportCsv(filteredCashiers)}
        />

        <CashiersTable
          cashiers={filteredCashiers}
          selectedRowId={selectedCashier?.id}
          onSelectRow={(row) => setSelectedCashier(row)}
        />

        <AddCashierForm isOpen={addOpen} onClose={() => setAddOpen(false)} />

        <DeactivateCashierPopup
          isOpen={deactivatePopupOpen}
          onClose={() => setDeactivatePopupOpen(false)}
          cashier={selectedCashier ?? undefined}
          onConfirm={() => {
            if (!selectedCashier) return;

            const updatedStatus =
              selectedCashier.status === "Active" ? "Deactive" : "Active";

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
              <>
                <br />
                <br />
                ID - {c.id}
                <br />
                Cashier Name- {c.name}
              </>
            )}
            onConfirm={() => {
              const index = mockCashiers.findIndex((c) => c.id === selectedCashier.id);
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
              const index = mockCashiers.findIndex((c) => c.id === selectedCashier.id);
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