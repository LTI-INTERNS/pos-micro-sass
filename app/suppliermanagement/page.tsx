"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "../components/dashboard_layout";
import SearchBar from "../components/supplier-searchbar";
import SupplierActionsBar from "../components/supplier-actions";
import SupplierTable from "../components/supplier-table";
import StatCardGrid from "../components/supplierStatCardGrid";
import DateRangeBar from "../components/DateRangeBar";
import { suppliers } from "../Dashboard/mockData";

export default function SupplierPage() {
  const [selectedType, setSelectedType] = useState<"All" | "Individual" | "Company">("All")
  const filteredSuppliers = useMemo(() => {
    if (selectedType === "All") return suppliers;
    return suppliers.filter((s) => s.type === selectedType);
  }, [selectedType]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangeBar />
        <StatCardGrid />
        <SearchBar />
        <SupplierActionsBar />

        
        <div className="flex gap-6 px-2 text-sm font-medium">
          {["All", "Individual", "Company"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer text-black">
              <input
                type="radio"
                name="supplierType"
                value={type}
                checked={selectedType === type}
                onChange={() =>
                  setSelectedType(type as "All" | "Individual" | "Company")
                }
                className="accent-orange-500"
              />
              {type}
            </label>
          ))}
        </div>

        
        <SupplierTable suppliers={filteredSuppliers} />
      </div>
    </DashboardLayout>
  );
}
