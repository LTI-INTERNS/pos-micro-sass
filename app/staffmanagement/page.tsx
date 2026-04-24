"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import AddStaffPopup from "@/components/Admin/staffmanagement/AddStaffPopup";
import EditStaffPopup from "@/components/Admin/staffmanagement/EditStaffPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import FilterChips from "@/components/Admin/common/FilterChips";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import TabSelector from "@/components/Admin/common/TabSelector";
import ModalShell from "@/components/Admin/common/ModalShell";
import PopupActions from "@/components/Admin/common/PopupActions";
import DeletePopup from "@/components/Admin/common/Deletepopup";
import {
  useTableFilters,
  getFilterOptions,
} from "@/components/Admin/common/Filterlogic";
import { useCSVExport } from "@/components/Admin/common/csvExport";
import { staffService } from "@/lib/services/staff-service";
import type {
  AdminStaff,
  ManagerStaff,
  StaffCreateOptions,
  StaffDirectory,
  StaffTab,
} from "@/types/staff.types";

type AdminTableRow = AdminStaff & { assignedCompanyNames: string };
type ManagerTableRow = ManagerStaff;

const EMPTY_OPTIONS: StaffCreateOptions = {
  managerBranches: [],
  adminCompanies: [],
  existingAdmins: [],
};

const TABS = [
  { id: "admins", label: "Admins" },
  { id: "managers", label: "Managers" },
];

export default function StaffManagementPage() {
  const { data: session } = useSession();
  const userRole = String(session?.user?.role ?? "").toUpperCase();

  const [directory, setDirectory] = useState<StaffDirectory>({ admins: [], managers: [] });
  const [createOptions, setCreateOptions] = useState<StaffCreateOptions>(EMPTY_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [actionError, setActionError] = useState("");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StaffTab>("admins");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const exportCSV = useCSVExport();

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      setFetchError("");
      const data = await staffService.getAll();
      setDirectory(data);
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
      setCreateOptions(EMPTY_OPTIONS);
    } finally {
      setOptionsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
    fetchCreateOptions();
  }, [fetchStaff, fetchCreateOptions]);

  useEffect(() => {
    setSelectedId(null);
    setFilters({});
    setSearch("");
    setShowFilter(false);
  }, [activeTab]);

  useEffect(() => {
    if (!actionError) return;
    const timer = window.setTimeout(() => setActionError(""), 5000);
    return () => window.clearTimeout(timer);
  }, [actionError]);

  const adminRows = useMemo<AdminTableRow[]>(
    () =>
      directory.admins.map((admin) => ({
        ...admin,
        assignedCompanyNames: admin.assignedCompanies.map((company) => company.name).join(", "),
      })),
    [directory.admins]
  );

  const managerRows = directory.managers;

  const selectedStaff =
    activeTab === "admins"
      ? adminRows.find((item) => item.id === selectedId) ?? null
      : managerRows.find((item) => item.id === selectedId) ?? null;

  const filteredAdmins = useTableFilters<AdminTableRow>({
    data: adminRows,
    search,
    searchKeys: ["name", "staffNo", "email", "phone", "assignedCompanyNames"],
    filters,
  });

  const filteredManagers = useTableFilters<ManagerTableRow>({
    data: managerRows,
    search,
    searchKeys: ["name", "staffNo", "email", "phone", "branchName"],
    filters,
  });

  const adminColumns: Column<AdminTableRow>[] = [
        {
      key: "index",
      label: "",
      render: (_, index) => index + 1,
    },
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    {
      key: "assignedCompanies",
      label: "Assigned Companies",
      render: (row) => (
        <div className="flex flex-wrap gap-1.5">
          {row.assignedCompanies.map((company) => (
            <span
              key={company.companyId}
              className="inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-[11px] text-gray-600"
            >
              {company.name}
            </span>
          ))}
        </div>
      ),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const managerColumns: Column<ManagerTableRow>[] = [
        {
      key: "index",
      label: "",
      render: (_, index) => index + 1,
    },
    { key: "name", label: "Name" },
    { key: "staffNo", label: "Staff No" },
    { key: "branchName", label: "Branch" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
  ];

  const filterFields = useMemo(() => {
    if (activeTab !== "managers") return [];

    return [
      {
        name: "branchName",
        placeholder: "Branch",
        options: getFilterOptions(managerRows, "branchName"),
      },
    ];
  }, [activeTab, managerRows]);

  const isFilterApplied =
    activeTab === "managers" &&
    Object.values(filters).some((value) => value && value.trim() !== "");

  const noAdminCapacity = userRole === "OWNER" && createOptions.adminCompanies.length === 0;
  const noManagerCapacity = createOptions.managerBranches.length === 0;

  const canEditSelected =
    !!selectedStaff && !(selectedStaff.role === "ADMIN" && userRole !== "OWNER");
  const canDeleteSelected =
    !!selectedStaff && !(selectedStaff.role === "ADMIN" && userRole !== "OWNER");

  const openAddPopup = () => {
    if (userRole === "OWNER") {
      if (noAdminCapacity && noManagerCapacity) {
        setInfoMessage(
          "All available companies already have admin accounts, and all available branches already have manager accounts."
        );
        setShowInfoPopup(true);
        return;
      }
    } else if (noManagerCapacity) {
      setInfoMessage("All available branches already have manager accounts assigned.");
      setShowInfoPopup(true);
      return;
    }

    setShowAddPopup(true);
  };

  const handleDeleteClick = () => {
    if (!selectedStaff) {
      setActionError("Please select a staff row first.");
      return;
    }

    if (!canDeleteSelected) {
      setActionError("Admin accounts can only be deleted by the owner.");
      return;
    }

    setShowDeletePopup(true);
  };

  const handleEditClick = () => {
    if (!selectedStaff) {
      setActionError("Please select a staff row first.");
      return;
    }

    if (!canEditSelected) {
      setActionError("Admin accounts can only be edited by the owner.");
      return;
    }

    setShowEditPopup(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStaff) return;

    try {
      setActionError("");
      await staffService.remove(selectedStaff.id);
      setShowDeletePopup(false);
      setSelectedId(null);
      await fetchStaff();
      await fetchCreateOptions();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to delete staff member.";
      setActionError(message);
    }
  };

  const exportData =
    activeTab === "admins"
      ? filteredAdmins.map((row) => ({
          name: row.name,
          staffNo: row.staffNo,
          assignedCompanies: row.assignedCompanyNames,
          email: row.email,
          phone: row.phone,
        }))
      : filteredManagers.map((row) => ({
          name: row.name,
          staffNo: row.staffNo,
          branchName: row.branchName,
          email: row.email,
          phone: row.phone,
        }));

  const visibleMessage = actionError || fetchError;
  const shouldShowStaffActions = !(userRole === "ADMIN" && activeTab === "admins");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TabSelector tabs={TABS} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as StaffTab)} />

        {visibleMessage && (
          <div className="flex items-start justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <span>{visibleMessage}</span>
            <button
              type="button"
              onClick={() => {
                setActionError("");
                setFetchError("");
              }}
              className="shrink-0 rounded-full p-1 hover:bg-red-100"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={`Search ${activeTab === "admins" ? "Admins" : "Managers"}...`}
            showClear={true}
            showFilter={activeTab === "managers"}
            filterLabel="Filter"
            onFilter={() => setShowFilter(true)}
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />

          {activeTab === "managers" && (
            <>
              <FilterChips
                filters={filters}
                onRemove={(key) => setFilters((prev) => ({ ...prev, [key]: "" }))}
              />

              <FilterPopup
                open={showFilter}
                onClose={() => setShowFilter(false)}
                fields={filterFields}
                onApply={(values) => setFilters(values)}
              />
            </>
          )}
        </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {shouldShowStaffActions && (
              <>
                <ActionButton
                  className="rounded-full border border-orange-500 px-4 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50"
                  label="Delete Staff"
                  variant="outline"
                  onClick={handleDeleteClick}
                />

                <ActionButton
                  className="rounded-full border border-orange-500 px-4 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50"
                  label="Edit Staff"
                  variant="outline"
                  onClick={handleEditClick}
                />

                <ActionButton
                  className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
                  label="Add New Staff"
                  variant="primary"
                  onClick={openAddPopup}
                />
              </>
            )}

            <ActionButton
              className="rounded-full bg-orange-500 px-5 py-2 text-xs font-semibold text-white"
              label="Export CSV"
              variant="primary"
              onClick={() =>
                exportCSV(
                  exportData,
                  activeTab === "admins" ? "admin-list.csv" : "manager-list.csv"
                )
              }
            />
          </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <span className="text-gray-400">Loading staff data...</span>
          </div>
        ) : activeTab === "admins" ? (
          <CommonTable
            title="Admin Accounts"
            data={filteredAdmins}
            columns={adminColumns}
            emptyMessage="No admin accounts found"
            selectedRowId={selectedId ?? undefined}
            onSelectRow={(row) => setSelectedId(row?.id ?? null)}
          />
        ) : (
          <CommonTable
            title="Manager Accounts"
            data={filteredManagers}
            columns={managerColumns}
            emptyMessage="No manager accounts found"
            selectedRowId={selectedId ?? undefined}
            onSelectRow={(row) => setSelectedId(row?.id ?? null)}
          />
        )}
      </div>

      <AddStaffPopup
        isOpen={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onSuccess={async () => {
          await fetchStaff();
          await fetchCreateOptions();
        }}
        options={createOptions}
        optionsLoading={optionsLoading}
      />

      <EditStaffPopup
        isOpen={showEditPopup}
        staff={selectedStaff as AdminStaff | ManagerStaff | null}
        options={createOptions}
        currentUserRole={userRole}
        onClose={() => setShowEditPopup(false)}
        onSuccess={async () => {
          await fetchStaff();
          await fetchCreateOptions();
          setSelectedId(null);
        }}
      />

      {selectedStaff && showDeletePopup && (
        <DeletePopup
          isOpen={showDeletePopup}
          item={selectedStaff}
          itemName="Staff"
          onClose={() => setShowDeletePopup(false)}
          onConfirm={handleDeleteConfirm}
          getDisplayText={(item) => (
            <>
              <span className="font-semibold">{item.name}</span>
              <br />
              {item.position}
            </>
          )}
        />
      )}

      <ModalShell
        open={showInfoPopup}
        title="No Staff Slots Available"
        onClose={() => setShowInfoPopup(false)}
        widthClassName="w-[520px] max-w-[92vw]"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">{infoMessage}</p>
          <PopupActions
            actions={[
              {
                label: "Okay",
                onClick: () => setShowInfoPopup(false),
                variant: "primary",
              },
            ]}
          />
        </div>
      </ModalShell>
    </DashboardLayout>
  );
}