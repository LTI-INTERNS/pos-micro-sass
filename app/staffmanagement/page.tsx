"use client";

import { useState, useMemo } from "react";

import DashboardLayout from "../components/Admin/common/dashboard_layout";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import SearchBar from "../components/Admin/common/Search-bar";
import CommonTable, { Column } from "../components/Admin/common/CommonTable";
import AddStaffPopup from "./popup/AddStaffPopup";
import ActionButton from "../components/Admin/common/ActionButton";

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

  const columns: Column<Staff>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "pin", label: "Pin" },
  ];

  // Search
  const filteredStaff = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return staffData;

    return staffData.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(query)
      )
    );
  }, [search]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DateRangeBar />

        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search Staff..."
          showClear={true}
          showFilter={true}
          filterLabel="Filter"
          onFilter={() => console.log("Filter clicked")}
        />

        <div className="flex flex-wrap gap-3 mt-4">
        <ActionButton
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50"
            label="Delete Staff"
            variant="outline"
            onClick={() => console.log("Open add modal")}
        />

        <ActionButton
            className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50"
            label="Edit Staff"
            variant="outline"
            onClick={() => console.log("Open add modal")}
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
            onClick={() => console.log("Open add modal")}
        />

        </div>
        <CommonTable
          title="Staff List"
          data={filteredStaff}
          columns={columns}
          emptyMessage="No staff found"
        />
      </div>

      {showPopup && (
        <AddStaffPopup onClose={() => setShowPopup(false)} />
      )}
    </DashboardLayout>
  );
}
