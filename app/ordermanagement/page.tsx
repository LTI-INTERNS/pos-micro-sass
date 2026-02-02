"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import StatCardGrid from "@/app/components/Admin/productmanagement/productStarCardGrid";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import OrderActionsBar from "@/app/components/Admin/ordermanagement/order-actions";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import OrdersTable from "@/app/components/Admin/ordermanagement/order-table";
import { filterRows } from "./filterRows";
import { ordersData } from "./data";

type Order = {
  id: number;
  name: string;
  price: string;
  discount: string;
  tax: number;
  stock: string;
};

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    tax: "",
    stock: "",
  });

  const filterFields: SelectField[] = useMemo(() => {
    const uniqueTaxes = Array.from(new Set(ordersData.map((p: Order) => p.tax)))
      .filter((v) => v !== null && v !== undefined)
      .map(String);

    const uniqueStocks = Array.from(new Set(ordersData.map((p: Order) => p.stock))).filter(Boolean);

    return [
      {
        name: "tax",
        placeholder: "Select Tax",
        options: uniqueTaxes.map((t) => ({ label: t, value: t })),
      },
      {
        name: "stock",
        placeholder: "Select Stock",
        options: uniqueStocks.map((s) => ({ label: s, value: s })),
      },
    ];
  }, []);

  const filteredOrders = useMemo(() => {
    const searched = filterRows<Order>(ordersData as Order[], query, [
      "name",
      "price",
      "discount",
      "tax",
      "stock",
    ]);

    return searched.filter((p) => {
      if (filters.tax && String(p.tax) !== filters.tax) return false;
      if (filters.stock && p.stock !== filters.stock) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangePicker />
        <StatCardGrid />

        <div className="relative w-full">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search orders..."
            showFilter
            filterLabel="Filter"
            onFilter={() => setFilterOpen(true)}
          />

          <FilterPopup
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            fields={filterFields}
            onApply={(values) => {
              setFilters(values);
              setFilterOpen(false); 
            }}
          />
        </div>

        <OrderActionsBar />

        <OrdersTable orders={filteredOrders} />
      </div>
    </DashboardLayout>
  );
}
