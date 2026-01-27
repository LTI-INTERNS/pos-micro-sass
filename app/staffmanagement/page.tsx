"use client";

import { useState } from "react";

import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import CommonTable, { Column } from "../components/Admin/common/CommonTable";
import AddStaffPopup from "./popup/AddStaffPopup";
import ActionButton from "../components/Admin/common/ActionButton";

import FilterPopup from "../components/Admin/common/FilterPopup";
import { useTableFilters, getFilterOptions } from "../components/Admin/common/Filterlogic";
import { useCSVExport } from "../components/Admin/common/csvExport";

import { staffData } from "./mock/mockStaffData";

type Staff = {
  id: string;
  name: string;
  staffNo: string;
  position: string;
  email: string;
  password: string;
  pin: string;
};

export default function StaffManagementPage() {
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // Store applied dropdown filters
  const [filters, setFilters] = useState<Record<string, string>>({});

  const exportCSV = useCSVExport();

  const columns: Column<Staff>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "pin", label: "Pin" },
  ];

  //  Apply search + dropdown filter using reusable logic
  const filteredStaff = useTableFilters<Staff>({
    data: staffData,
    search,
    searchKeys: ["id", "name", "staffNo", "position", "email"],
    filters,
  });

  //  Generate position dropdown dynamically
  const filterFields = [
    {
      name: "position",
      placeholder: "Position",
      options: getFilterOptions(staffData, "position"),
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DateRangeBar />

        {/* Search Bar */}
        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Staff..."
            showClear={true}
            showFilter={true}
            filterLabel="Filter"
            onFilter={() => setShowFilter(true)}
          />

          {/* Filter Popup */}
          <FilterPopup
            open={showFilter}
            onClose={() => setShowFilter(false)}
            fields={filterFields}
            onApply={(values) => setFilters(values)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-4">
          <ActionButton
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50"
            label="Delete Staff"
            variant="outline"
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

          {/*  Export Filtered CSV */}
          <ActionButton
            className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold"
            label="Export CSV"
            variant="primary"
            onClick={() => exportCSV(filteredStaff, "staff-list.csv")}
          />
        </div>

        {/* Table */}
        <CommonTable
          title="Staff List"
          data={filteredStaff}
          columns={columns}
          emptyMessage="No staff found"
        />
      </div>

      {/* Add Staff Popup */}
      {showPopup && (
        <AddStaffPopup onClose={() => setShowPopup(false)} />
      )}
    </DashboardLayout>
  );
}
