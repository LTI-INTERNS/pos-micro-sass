"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import DateRangeBar from "@/components/Admin/common/DateRangeBar";
import SearchBar from "@/components/Admin/common/Search-bar";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import AddStaffPopup from "@/components/Admin/staffmanagement/AddStaffPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import FilterChips from "@/components/Admin/common/FilterChips";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import {
  useTableFilters,
  getFilterOptions,
} from "@/components/Admin/common/Filterlogic";
import { useCSVExport } from "@/components/Admin/common/csvExport";
import { staffService, Staff } from "@/lib/services";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";

type UserRole = "superadmin" | "admin" | "manager";

export default function StaffManagementPage() {
  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);

  useEffect(() => {
    staffService.getAll()
      .then(setAllStaff)
      .finally(() => setIsLoading(false));
  }, []);

  const userRole: UserRole = "superadmin" as UserRole;
  const userBranch = "Kandy" as const;

  const baseData = useMemo(() => {
    return userRole === "superadmin"
      ? allStaff
      : allStaff.filter((s) => s.branch === userBranch);
  }, [userRole, userBranch, allStaff]);

  const exportCSV = useCSVExport();

  const columns: Column<Staff>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    { key: "branch", label: "Branch Name" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "password", label: "Password" },
    { key: "pin", label: "Pin" },
  ];

  const filteredStaff = useTableFilters<Staff>({
    data: baseData,
    search,
    searchKeys: ["id", "name", "staffNo", "branch", "position", "email"],
    filters,
  });

  const filterFields = useMemo(() => {
    return [
      {
        name: "position",
        placeholder: "Position",
        options: getFilterOptions(baseData, "position"),
      },
      ...(userRole === "superadmin"
        ? [
          {
            name: "branch",
            placeholder: "Branch",
            options: getFilterOptions(allStaff, "branch"),
          },
        ]
        : []),
    ];
  }, [userRole, baseData, allStaff]);

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
    { name: "name", label: "Name", type: "text" },
    { name: "staffNo", label: "Staff No", type: "text" },
    { name: "branch", label: "Branch", type: "text" },
    { name: "position", label: "Position", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "number" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DateRangeBar />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Staff..."
            showClear={true}
            showFilter={true}
            filterLabel="Filter"
            onFilter={() => setShowFilter(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />

          <FilterChips filters={filters} onRemove={removeFilter} />

          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            fields={filterFields}
            onApply={(values) => setFilters(values)}
          />
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <ActionButton
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50"
            label="Delete Staff"
            variant="outline"
            onClick={() => {
              if (!selectedStaff) {
                alert("Please select a cashier first!");
                return;
              }
              setDeletePopupOpen(true);
            }}
          />

          <ActionButton
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50"
            label="Edit Staff"
            variant="outline"
            onClick={() => {
              if (!selectedStaff) {
                alert("Please select a staff first!");
                return;
              }
              setEditPopupOpen(true);
            }}
          />

          <ActionButton
            className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold"
            label="Add New Staff"
            variant="primary"
            onClick={() => setShowPopup(true)}
          />

          <ActionButton
            className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold"
            label="Export CSV"
            variant="primary"
            onClick={() => exportCSV(filteredStaff, "staff-list.csv")}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="text-gray-400">Loading staff data...</span>
          </div>
        ) : (
          <CommonTable
            title="Staff List"
            data={filteredStaff}
            columns={columns}
            emptyMessage="No staff found"
            selectedRowId={selectedStaff?.id}
            onSelectRow={(row) => {
              setSelectedStaff(row);
            }}
          />
        )}
      </div>

      {showPopup && (
        <AddStaffPopup onClose={() => setShowPopup(false)} />
      )}

      {selectedStaff && deletePopupOpen && (
        <DeletePopup
          isOpen={deletePopupOpen}
          item={selectedStaff}
          itemName="Staff"
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={() => {
            setAllStaff((prev) => prev.filter((c) => c.id !== selectedStaff.id));
            setSelectedStaff(null);
            setDeletePopupOpen(false);
          }}
        />
      )}

      {selectedStaff && editPopupOpen && (
        <EditEntityModal<Staff>
          open={editPopupOpen}
          title="Edit Staff"
          initialValues={selectedStaff}
          onClose={() => setEditPopupOpen(false)}
          onSave={(values) => {
            setAllStaff((prev) =>
              prev.map((s) => (s.id === selectedStaff.id ? { ...s, ...values } : s))
            );
            setSelectedStaff(null);
            setEditPopupOpen(false);
          }}
          fields={editFields}
        />
      )}
    </DashboardLayout>
  );
}