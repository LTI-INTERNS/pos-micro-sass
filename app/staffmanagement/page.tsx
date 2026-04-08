"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
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
import DeletePopup from "@/components/Admin/common/Deletepopup";
import EditEntityModal, { EditField } from "@/components/Admin/common/EditPopup";
import { staffService } from "@/lib/services/staff-service";
import type { Staff, StaffCreateOptions } from "@/types/staff.types";

const emptyOptions: StaffCreateOptions = {
  managerBranches: [],
  adminCompanies: [],
};

export default function StaffManagementPage() {
  const { data: session } = useSession();
  const userRole = String(session?.user?.role ?? "").toUpperCase();

  const [allStaff, setAllStaff] = useState<Staff[]>([]);
  const [createOptions, setCreateOptions] = useState<StaffCreateOptions>(emptyOptions);

  const [isLoading, setIsLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");

  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});

  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [deletePopupOpen, setDeletePopupOpen] = useState(false);
  const [editPopupOpen, setEditPopupOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const exportCSV = useCSVExport();

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const data = await staffService.getAll();
      setAllStaff(data);
    } catch {
      setFetchError("Failed to load staff data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCreateOptions = useCallback(async () => {
    try {
      setOptionsLoading(true);
      const data = await staffService.getCreateOptions();
      setCreateOptions(data);
    } catch {
      setCreateOptions(emptyOptions);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
    fetchCreateOptions();
  }, [fetchStaff, fetchCreateOptions]);

  const filteredStaff = useTableFilters<Staff>({
    data: allStaff,
    search,
    searchKeys: ["id", "name", "staffNo", "scopeName", "position", "email", "phone"],
    filters,
  });

  const columns: Column<Staff>[] = [
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    { key: "scopeName", label: "Branch/Company" },
    { key: "position", label: "Position" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const filterFields = useMemo(() => {
    return [
      {
        name: "position",
        placeholder: "Position",
        options: getFilterOptions(allStaff, "position"),
      },
      {
        name: "scopeName",
        placeholder: "Branch/Company",
        options: getFilterOptions(allStaff, "scopeName"),
      },
    ];
  }, [allStaff]);

  const isFilterApplied = Object.values(filters).some(
    (value) => value && value.trim() !== ""
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
    { name: "scopeName", label: "Branch/Company", type: "text", readOnly: true },
    { name: "position", label: "Position", type: "text", readOnly: true },
    { name: "email", label: "Email", type: "text" },
    { name: "phone", label: "Phone", type: "text" },
  ];

  const handleDelete = async () => {
    if (!selectedStaff) return;

    setActionLoading(true);
    setActionError("");

    try {
      await staffService.remove(selectedStaff.id);
      setDeletePopupOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
      await fetchCreateOptions();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to delete staff member. Please try again.";
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async (values: Staff) => {
    if (!selectedStaff) return;

    setActionLoading(true);
    setActionError("");

    try {
      await staffService.update(selectedStaff.id, {
        name: values.name,
        staffNo: values.staffNo,
        email: values.email,
        phone: values.phone,
      });

      setEditPopupOpen(false);
      setSelectedStaff(null);
      await fetchStaff();
      await fetchCreateOptions();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to update staff member. Please try again.";
      setActionError(message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {(fetchError || actionError) && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300">
            {fetchError || actionError}
            <button
              className="ml-3 underline text-red-400 hover:text-red-300"
              onClick={() => {
                setFetchError("");
                setActionError("");
              }}
            >
              Dismiss
            </button>
          </div>
        )}

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
            label={actionLoading ? "Deleting..." : "Delete Staff"}
            variant="outline"
            onClick={() => {
              if (!selectedStaff) {
                alert("Please select a staff member first!");
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
                alert("Please select a staff member first!");
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
            onSelectRow={(row) => setSelectedStaff(row)}
          />
        )}
      </div>

      <AddStaffPopup
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        options={createOptions}
        optionsLoading={optionsLoading}
        onSuccess={async () => {
          await fetchStaff();
          await fetchCreateOptions();
        }}
      />

      {selectedStaff && deletePopupOpen && (
        <DeletePopup
          isOpen={deletePopupOpen}
          item={selectedStaff}
          itemName="Staff"
          onClose={() => setDeletePopupOpen(false)}
          onConfirm={handleDelete}
          getDisplayText={(item) => (
            <>
              <span className="font-semibold">{item.name}</span>
              <br />
              {item.position} · {item.scopeName}
            </>
          )}
        />
      )}

      {selectedStaff && editPopupOpen && (
        <EditEntityModal<Staff>
          open={editPopupOpen}
          title="Edit Staff"
          initialValues={selectedStaff}
          onClose={() => setEditPopupOpen(false)}
          onSave={handleEdit}
          fields={editFields}
        />
      )}

      {userRole !== "OWNER" && (
        <div className="hidden" aria-hidden="true" />
      )}
    </DashboardLayout>
  );
}