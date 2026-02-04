"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import SearchBar from "../components/Admin/common/Search-bar";
import SupplierActionsBar from "../components/Admin/suppliermanagement/SupplierActionBar";
import SupplierTable from "../components/Admin/suppliermanagement/SupplierTable";
import StatCardGrid from "../components/Admin/suppliermanagement/StatCardGrid";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import FilterPopup from "../components/Admin/common/FilterPopup"; 
import FilterChips from "@/app/components/Admin/common/FilterChips";


export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
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
    email: "sunil@gmail.com",
    coverarea: "Central Province",
    branches: ["Kandy", "Matale"],
    regNo: "SUP-003",
  },
];

export default function SupplierPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);


  const isFilterApplied = Object.values(filters).some(
    (v) => v && v.trim() !== ""
  );

  const removeFilter = (key: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: "",
    }));
  };

  
  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((s) => {
      const matchesType = !filters.supplierType || s.type === filters.supplierType;

      const matchesCoverArea =
        !filters.coverarea ||
        s.coverarea.toLowerCase().includes(filters.coverarea.toLowerCase().trim());

      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesType && matchesCoverArea && matchesSearch;
    });
  }, [filters, search, suppliersList]);
  
  const handleDeleteSupplier = () => {
    if (!selectedSupplier) return;
    setSuppliersList((prev) => prev.filter((s) => s.id !== selectedSupplier.id));
    setSelectedSupplier(null);
  };
  

  return (
    <DashboardLayout>
      
      <div className="w-full space-y-6 relative">
        <DateRangeBar />
        <StatCardGrid />

        
        <div className="relative">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search supplier by name"
            debounceMs={300}
            showFilter={true}
            onFilter={() => setFilterOpen(true)} 
            isFilterApplied={isFilterApplied}
            onClearFilters={() => setFilters({})}
          />
          <FilterChips
            filters={filters}
            onRemove={removeFilter}
          />

          
          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={[
              {
                name: "supplierType",
                placeholder: "Select supplier type",
                options: [
                  { label: "Individual", value: "Individual" },
                  { label: "Company", value: "Company" },
                ],
              },
              {
                name: "coverarea",
                placeholder: "Select cover area",
                options: [
                  { label: "Western Province", value: "Western Province" },
                  { label: "Central Province", value: "Central Province" },
                  { label: "Southern Province", value: "Southern Province" },
                ],
              },
            ]}
            onApply={(values) => {
              setFilters((prev) => ({ ...prev, ...values }));
            }}
          />
        </div>

          <SupplierActionsBar
            selectedSupplier={selectedSupplier}
            onDelete={handleDeleteSupplier}
          />
          <SupplierTable
          suppliers={filteredSuppliers}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
        />
        </div>
    </DashboardLayout>
  );
}
