"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../components/Admin/common/dashboard_layout";
import SearchBar from "../components/Admin/common/Search-bar";
import ActionButton from "../components/Admin/common/ActionButton";
import SupplierTable from "../components/Admin/suppliermanagement/SupplierTable";
import StatCardGrid from "../components/Admin/suppliermanagement/StatCardGrid";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import SupplierPopUp from "../components/Admin/suppliermanagement/SupplierPopUp";
import FilterPopup from "../components/Admin/common/FilterPopup"; 

export type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
  phone: number;
  email: string;
  address: string;
  regNo: string;
};

const suppliers: Supplier[] = [
  {
    id: 1,
    type: "Individual",
    name: "Kamal Perera",
    phone: 771234567,
    email: "kamal@gmail.com",
    address: "Colombo",
    regNo: "SUP-001",
  },
  {
    id: 2,
    type: "Company",
    name: "ABC Traders",
    phone: 719876543,
    email: "abc@gmail.com",
    address: "Kandy",
    regNo: "SUP-002",
  },
  {
    id: 3,
    type: "Individual",
    name: "Sunil Fernando",
    phone: 761112233,
    email: "sunil@gmail.com",
    address: "Galle",
    regNo: "SUP-003",
  },
];

export default function SupplierPage() {
  const [selectedType, setSelectedType] = useState<
    "All" | "Individual" | "Company"
  >("All");

  const [search, setSearch] = useState("");

  
  const [open, setOpen] = useState(false);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(suppliers);

  
  const [filterOpen, setFilterOpen] = useState(false);

  
  const filteredSuppliers = useMemo(() => {
    return suppliersList.filter((s) => {
      const matchesType = selectedType === "All" || s.type === selectedType;

      const matchesSearch = s.name
        .toLowerCase()
        .includes(search.toLowerCase().trim());

      return matchesType && matchesSearch;
    });
  }, [selectedType, search, suppliersList]);

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
          />

          
          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={[
              {
                name: "supplierType",
                placeholder: "Select supplier type",
                options: [
                  { label: "All", value: "All" },
                  { label: "Individual", value: "Individual" },
                  { label: "Company", value: "Company" },
                ],
              },
            ]}
            onApply={(values) => {
              const type = values.supplierType as
                | "All"
                | "Individual"
                | "Company"
                | "";

              
              if (!type) return;

              setSelectedType(type);
            }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <ActionButton
            label="Delete Supplier"
            className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
          />
          <ActionButton
            label="Edit Supplier"
            className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
          />
          <ActionButton
            label="Add New Supplier"
            variant="primary"
            className="w-full rounded-full bg-orange-500 py-2
                     text-xs font-semibold text-white
                     hover:bg-orange-600
                     transition"
            onClick={() => setOpen(true)}
          />

          <SupplierPopUp
            open={open}
            onClose={() => setOpen(false)}
            supplierId="A001"
            onSave={(vals) => {
              console.log(vals);
              setOpen(false);
            }}
          />
        </div>

        
        

        <SupplierTable suppliers={filteredSuppliers} />
      </div>
    </DashboardLayout>
  );
}
