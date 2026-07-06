"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import AddStaffPopup from "@/components/Admin/staffmanagement/AddStaffPopup";
import EditStaffPopup from "@/components/Admin/staffmanagement/EditStaffPopup";
import ActionButton from "@/components/Admin/common/ActionButton";
import FilterChips from "@/components/Admin/common/FilterChips";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import TabSelector from "@/components/Admin/common/TabSelector";
import StaffDeleteWarningModal, { StaffDeleteWarnings } from "@/components/Admin/staffmanagement/StaffDeleteWarningModal";
import {
  useTableFilters,
  getFilterOptions,
} from "@/components/Admin/common/Filterlogic";
import { useCSVExport } from "@/components/Admin/common/csvExport";
import { staffService } from "@/lib/services/staff-service";
import { cashierService } from "@/lib/services/cashier-service";
import { orderService } from "@/lib/services/order-service";

import ToastNotification from "@/components/Admin/common/ToastNotification";
import { useToast } from "@/hooks/useToast";
import LoadingState from "@/components/Admin/common/LoadingState";
import RefreshButton from "@/components/Admin/common/RefreshButton";

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

  const { toasts, showToast, dismissToast } = useToast();

  const [directory, setDirectory] = useState<StaffDirectory>({ admins: [], managers: [] });
  const [createOptions, setCreateOptions] = useState<StaffCreateOptions>(EMPTY_OPTIONS);
  const [isLoading, setIsLoading] = useState(true);
  const [optionsLoading, setOptionsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<StaffTab>("admins");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Delete warning modal state
  const [deleteWarningOpen, setDeleteWarningOpen] = useState(false);
  const [deleteWarnings, setDeleteWarnings] = useState<StaffDeleteWarnings>({ role: "MANAGER" });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const exportCSV = useCSVExport();

  const fetchStaff = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await staffService.getAll();
      setDirectory(data);
    } catch {
      showToast("Failed to load staff data. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const adminRows = useMemo<AdminTableRow[]>(
    () =>
      directory.admins.map((admin) => ({
        ...admin,
        assignedCompanyNames: admin.assignedCompanies.map((company) => company.name).join(", "),
      })),
    [directory.admins]
  );

  const managerRows = directory.managers;

  // Collect all existing phone numbers across all staff for duplicate checking
  const allExistingPhones = useMemo(
    () => [
      ...directory.admins.map((s) => s.phone.trim()),
      ...directory.managers.map((s) => s.phone.trim()),
    ],
    [directory]
  );

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
  const addStaffRole = activeTab === "admins" ? "ADMIN" : "MANAGER";

  const canEditSelected =
    !!selectedStaff && !(selectedStaff.role === "ADMIN" && userRole !== "OWNER");
  const canDeleteSelected =
    !!selectedStaff && !(selectedStaff.role === "ADMIN" && userRole !== "OWNER");

  const openAddPopup = () => {
    if (activeTab === "admins") {
      if (userRole !== "OWNER") {
        showToast("Admin accounts can only be added by the owner.", "error");
        return;
      }

      if (noAdminCapacity) {
        showToast("All available companies already have admin accounts.", "info");
        return;
      }
    } else if (noManagerCapacity) {
      showToast("All available branches already have manager accounts assigned.", "info");
      return;
    }

    setShowAddPopup(true);
  };

  // Step 1 — pre-check linked records and open warning modal
  const handleDeleteClick = async () => {
    if (!selectedStaff) {
      showToast("Please select a staff row first.", "error");
      return;
    }

    if (!canDeleteSelected) {
      showToast("Admin accounts can only be deleted by the owner.", "error");
      return;
    }

    setDeleteLoading(true);
    try {
      if (selectedStaff.role === "MANAGER") {
        const manager = selectedStaff as import("@/types/staff.types").ManagerStaff;
        const [allCashiers, branchOrders] = await Promise.all([
          cashierService.getAll(),
          orderService.getAll({ branchId: manager.branchId }),
        ]);
        const activeCashiers = allCashiers.filter(
          (c) => c.branchId === manager.branchId && c.activeStatus
        );
        setDeleteWarnings({
          role: "MANAGER",
          branchName: manager.branchName,
          activeCashierCount: activeCashiers.length,
          orderCount: branchOrders.length,
        });
      } else {
        // Admin
        const admin = selectedStaff as import("@/types/staff.types").AdminStaff;
        setDeleteWarnings({
          role: "ADMIN",
          assignedCompanyCount: admin.assignedCompanies.length,
          assignedCompanyNames: admin.assignedCompanies.map((c) => c.name),
        });
      }
      setDeleteWarningOpen(true);
    } catch {
      // Pre-check failed — still open modal with minimal info
      setDeleteWarnings({ role: selectedStaff.role });
      setDeleteWarningOpen(true);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEditClick = () => {
    if (!selectedStaff) {
      showToast("Please select a staff row first.", "error");
      return;
    }

    if (!canEditSelected) {
      showToast("Admin accounts can only be edited by the owner.", "error");
      return;
    }

    setShowEditPopup(true);
  };

  // Step 2 — user confirmed in the warning modal, actually delete
  const handleDeleteConfirm = async () => {
    if (!selectedStaff) return;
    setDeleteWarningOpen(false);
    try {
      await staffService.remove(selectedStaff.id);
      setSelectedId(null);
      await fetchStaff();
      await fetchCreateOptions();
      showToast("Staff deleted successfully!", "success");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error
          ?.message ?? "Failed to delete staff member.";
      showToast(message, "error");
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

  const shouldShowStaffActions = !(userRole === "ADMIN" && activeTab === "admins");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <TabSelector tabs={TABS} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as StaffTab)} />

        <div className="relative">
          <div className="flex gap-3 items-center">
            <div className="relative flex-1">
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

            <RefreshButton
              onClick={() => { void fetchStaff(); }}
              loading={isLoading}
              title="Refresh staff"
            />
          </div>
        </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {shouldShowStaffActions && (
              <>
                <ActionButton
                  className="rounded-full border border-orange-500 px-4 py-2 text-xs font-semibold text-orange-500 hover:bg-orange-50"
                  label={deleteLoading ? "Checking..." : "Delete Staff"}
                  variant="outline"
                  disabled={deleteLoading}
                  onClick={() => { void handleDeleteClick(); }}
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
          <LoadingState message="Loading staff data..." className="py-24" />
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
        role={addStaffRole}
        onClose={() => setShowAddPopup(false)}
        showToast={showToast}
        existingPhones={allExistingPhones}
        onSuccess={async () => {
          await fetchStaff();
          await fetchCreateOptions();
          showToast("Staff added successfully!", "success");
        }}
        options={createOptions}
        optionsLoading={optionsLoading}
      />

      <EditStaffPopup
        isOpen={showEditPopup}
        staff={selectedStaff as AdminStaff | ManagerStaff | null}
        options={createOptions}
        currentUserRole={userRole}
        showToast={showToast}
        existingPhones={allExistingPhones}
        onClose={() => setShowEditPopup(false)}
        onSuccess={async () => {
          await fetchStaff();
          await fetchCreateOptions();
          setSelectedId(null);
          showToast("Staff updated successfully!", "success");
        }}
      />

      {selectedStaff && deleteWarningOpen && (
        <StaffDeleteWarningModal
          isOpen={deleteWarningOpen}
          staffName={selectedStaff.name}
          staffRole={selectedStaff.role}
          warnings={deleteWarnings}
          onClose={() => setDeleteWarningOpen(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ToastNotification toasts={toasts} onDismiss={dismissToast} />
    </DashboardLayout>
  );
}
