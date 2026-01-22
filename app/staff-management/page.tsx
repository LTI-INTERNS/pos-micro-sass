"use client";

import { useState, useMemo } from "react";

import DashboardLayout from "../components/dashboard_layout";
import DateRangeBar from "../components/Dashboard/DateRangeBar";
import SearchBar from "../components/Dashboard/common/Search-bar";
import CommonTable, { Column } from "../components/Dashboard/common/CommonTable";
import StaffToolbar from "../components/StaffManagement/StaffToolbar";
import AddStaffPopup from "./AddStaffPopup";

import { staffData } from "./mockStaffData";
import { filterRows } from "../components/Dashboard/common/filterRows";

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

  const filteredStaff = useMemo(() => {
    return filterRows(staffData, search, [
      "id",
      "name",
      "staffNo",
      "position",
      "email",
    ]);
  }, [search, staffData]);

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

        <StaffToolbar onAdd={() => setShowPopup(true)} />

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
