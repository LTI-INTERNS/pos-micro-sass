"use client";

import { useMemo, useState, Suspense } from "react";
import DashboardLayout from "@/components/Admin/common/dashboard_layout";
import SearchBar from "@/components/Admin/common/Search-bar";
import SupplierActionsBar from "@/components/Admin/suppliermanagement/SupplierActionBar";
import SupplierTable from "@/components/Admin/suppliermanagement/SupplierTable";
import StatCardGrid from "@/components/Admin/suppliermanagement/StatCardGrid";
import FilterPopup from "@/components/Admin/common/FilterPopup";
import FilterChips from "@/components/Admin/common/FilterChips";
import { useSession } from "next-auth/react";

type UserRole = "owner" | "admin" | "manager";

export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
  address: string;
  phone: number;
  email: string;
  coverarea: string;
  branches: string[];
  regNo: string;
};

const suppliers: Supplier[] = [
  {
    id: 1,
    type: "Individual",
    name: "Kamal Perera",
    phone: 771234567,
    address: "120 Main Street, Nugegoda",
    email: "kamal@gmail.com",
    coverarea: "Western Province",
    branches: ["Colombo", "Negombo"],
    regNo: "SUP-001",
  },
  {
    id: 2,
    type: "Company",
    name: "ABC Traders",
    phone: 719876543,
    address: "123 Main Street, Colombo",
    email: "abc@gmail.com",
    coverarea: "Southern Province",
    branches: ["Galle", "Matara"],
    regNo: "SUP-002",
  },
  {
    id: 3,
    type: "Individual",
    name: "Sunil Fernando",
    phone: 761112233,
    address: "123 Main Street, Kandy",
    email: "sunil@gmail.com",
    coverarea: "Central Province",
    branches: ["Kandy", "Matale"],
    regNo: "SUP-003",
  },
];

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

  const { data: session, status } = useSession();

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
    console.log("Session status:", status);
    console.log("Full session:", session);
    console.log("Raw session role:", session?.user?.role);
    console.log("Normalized role:", role);
    console.log("Branch name:", branchName);
  }, [status, session, role, branchName]);

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

      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesType && matchesCoverArea && matchesSearch;
    });
  }, [filters, search, branchFilteredSuppliers, isManager]);

  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;

    setSuppliersList((prev) =>
      prev.filter((s) => s.id !== selectedSupplier.id)
    );
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
            }}
          />
        </div>

        {canManageSuppliers && (
          <SupplierActionsBar
            selectedSupplier={selectedSupplier}
            onDelete={handleDeleteSupplier}
            onEdit={(updatedSupplier: Supplier) => {
              setSuppliersList((prev) =>
                prev.map((s) =>
                  s.id === updatedSupplier.id ? updatedSupplier : s
                )
              );
              setSelectedSupplier(updatedSupplier);
            }}
          />
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