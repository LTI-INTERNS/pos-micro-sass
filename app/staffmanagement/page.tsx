"use client";

import { useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import CommonTable, { Column } from "../components/Admin/common/CommonTable";
import AddStaffPopup from "./popup/AddStaffPopup";
import ActionButton from "../components/Admin/common/ActionButton";
import FilterChips from "@/app/components/Admin/common/FilterChips";
import FilterPopup from "../components/Admin/common/FilterPopup";
import { useTableFilters, getFilterOptions } from "../components/Admin/common/Filterlogic";
import { useCSVExport } from "../components/Admin/common/csvExport";
import { staffData } from "./mock/mockStaffData";
import DeletePopup from "../components/Admin/common/Deletepopup"

type Staff = {
  id: string;
  name: string;
  staffNo: string;
  branch: string;
  position: string;
  email: string;
  phone: number;
  password: string;
  pin: string;
};

export default function StaffManagementPage() {
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);

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
    data: staffData,
    search,
    searchKeys: ["id", "name", "staffNo", "branch", "position", "email"],
    filters,
  });

  const filterFields = [
    {
      name: "position",
      placeholder: "Position",
      options: getFilterOptions(staffData, "position"),
    },
    {
      name: "branch",
      placeholder: "Branch",
      options: getFilterOptions(staffData, "branch"),
    },
  ];

  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

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

          <FilterChips
            filters={filters}
            onRemove={removeFilter}
          />
          
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
      </div>

      {showPopup && (
        <AddStaffPopup onClose={() => setShowPopup(false)} />
      )} 
      {selectedStaff && (
        <DeletePopup
          isOpen={deletePopupOpen}
          onClose={() => setDeletePopupOpen(false)}
          item={selectedStaff}
          itemName="Staff"
          getDisplayText={(c) => (
          <><br /><br />
            ID - {c.id}<br />
            Staff Name- {c.name}<br />
            Branch - {c.branch}<br />
            position - {c.position}
          </>
          )}
          onConfirm={() => {
            const index = staffData.findIndex(c => c.id === selectedStaff.id);
            if (index >= 0) staffData.splice(index, 1);
            setSelectedStaff(null);
            setDeletePopupOpen(false);
          }}
        />
      )}
    </DashboardLayout>
  );
}
