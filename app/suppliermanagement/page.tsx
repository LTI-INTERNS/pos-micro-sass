"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import SupplierActionsBar from "@/components/Admin/suppliermanagement/SupplierActionBar";
import SupplierTable from "@/components/Admin/suppliermanagement/SupplierTable";
import StatCardGrid from "@/components/Admin/suppliermanagement/StatCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useSession } from "next-auth/react";
import { supplierService } from "@/lib/services/supplier-service";
import { branchService } from "@/lib/services/branch-service";
import type { Supplier, CreateSupplierInput, UpdateSupplierInput } from "@/types/supplier.types";
import type { Branch } from "@/types/branch.types";

type UserRole = "owner" | "admin" | "manager";

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [suppliersList, setSuppliersList] = useState<Supplier[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data: session } = useSession();

  const sessionRole =
    typeof session?.user?.role === "string"
      ? session.user.role.toLowerCase()
      : undefined;

  const role: UserRole | undefined =
    sessionRole === "owner" ||
    sessionRole === "admin" ||
    sessionRole === "manager"
      ? sessionRole
      : undefined;

  const branchName = session?.user?.branchName?.trim() ?? "";

  const isOwner = role === "owner";
  const isAdmin = role === "admin";
  const isManager = role === "manager";

  const canViewAllSuppliers = isOwner || isAdmin;
  const canManageSuppliers = isOwner || isAdmin;

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        const [supplierData, branchData] = await Promise.all([
          supplierService.getAll(),
          branchService.getAll(),
        ]);

        if (ignore) return;

        setSuppliersList(supplierData);
        setBranches(branchData);
      } catch (error) {
        console.error("Failed to load suppliers:", error);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  const branchFilteredSuppliers = canViewAllSuppliers
    ? suppliersList
    : suppliersList.filter((s) => s.branches.includes(branchName));

  const removeFilter = (key: string) => {
    if (isManager && key === "coverarea") return;

    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  const filterFields = [
    {
      name: "supplierType",
      placeholder: "Select supplier type",
      options: [
        { label: "Individual", value: "Individual" },
        { label: "Company", value: "Company" },
      ],
    },
    ...(!isManager
      ? [
          {
            name: "coverarea",
            placeholder: "Select cover area",
            options: [
              { label: "Western Province", value: "Western Province" },
              { label: "Central Province", value: "Central Province" },
              { label: "Southern Province", value: "Southern Province" },
            ],
          },
        ]
      : []),
  ];

  const visibleFilters = isManager
    ? Object.fromEntries(
        Object.entries(filters).filter(([key]) => key !== "coverarea")
      )
    : filters;

  const filteredSuppliers = useMemo(() => {
    return branchFilteredSuppliers.filter((s) => {
      const matchesType =
        !filters.supplierType || s.type === filters.supplierType;

      const matchesCoverArea =
        isManager ||
        !filters.coverarea ||
        s.coverarea
          .toLowerCase()
          .includes(filters.coverarea.toLowerCase().trim());

      const nameToSearch = `${s.name} ${s.companyName ?? ""}`.toLowerCase();
      const matchesSearch = nameToSearch.includes(search.toLowerCase().trim());

      return matchesType && matchesCoverArea && matchesSearch;
    });
  }, [filters, search, branchFilteredSuppliers, isManager]);

 const handleAddSupplier = async (payload: CreateSupplierInput) => {
  try {
    console.log("ADDING SUPPLIER PAYLOAD:", payload);

    const created = await supplierService.create(payload);
    setSuppliersList((prev) => [created, ...prev]);
  } catch (error: any) {
    console.error("ADD SUPPLIER FULL ERROR:", error);
    console.error("ADD SUPPLIER RESPONSE:", error?.response);
    console.error("ADD SUPPLIER RESPONSE DATA:", error?.response?.data);
    throw error;
  }
};

  const handleEditSupplier = async (supplierId: string, payload: UpdateSupplierInput) => {
    const updated = await supplierService.update(supplierId, payload);

    setSuppliersList((prev) =>
      prev.map((supplier) => (supplier.id === updated.id ? updated : supplier))
    );
    setSelectedSupplier(updated);
  };

  const handleDeleteSupplier = async (supplierId: string) => {
    await supplierService.delete(supplierId);

    setSuppliersList((prev) => prev.filter((s) => s.id !== supplierId));
    setSelectedSupplier(null);
  };

  return (
    <DashboardLayout>
      <div className="w-full space-y-6 relative">
        <StatCardGrid suppliers={filteredSuppliers} userRole={role} />

        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search supplier by name"
            debounceMs={300}
            showFilter={true}
            onFilter={() => setFilterOpen(true)}
            isFilterApplied={Object.values(visibleFilters).some(
              (v) => v && v.trim() !== ""
            )}
            onClearFilters={() =>
              setFilters((prev) =>
                isManager ? { ...prev, supplierType: "", coverarea: "" } : {}
              )
            }
          />

          <FilterChips filters={visibleFilters} onRemove={removeFilter} />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => {
              const nextValues = isManager
                ? { ...values, coverarea: "" }
                : values;

              setFilters((prev) => ({ ...prev, ...nextValues }));
              setFilterOpen(false);
            }}
          />
        </div>

        {canManageSuppliers && (
          <Suspense fallback={null}>
            <SupplierActionsBar
              selectedSupplier={selectedSupplier}
              branches={branches}
              onAdd={handleAddSupplier}
              onEdit={handleEditSupplier}
              onDelete={handleDeleteSupplier}
            />
          </Suspense>
        )}

        <SupplierTable
          suppliers={filteredSuppliers}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          userRole={role}
        />
      </div>
    </DashboardLayout>
  );
}