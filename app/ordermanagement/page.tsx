"use client";

import { useMemo, useState } from "react";
import DashboardLayout from "@/app/components/Admin/common/dashboard_layout";
import DateRangePicker from "@/app/components/Admin/common/DateRangeBar";
import SearchBar from "@/app/components/Admin/common/Search-bar";
import OrderActionsBar from "@/app/components/Admin/ordermanagement/order-actions";
import FilterPopup, { type SelectField } from "@/app/components/Admin/common/FilterPopup";
import OrdersTable from "@/app/components/Admin/ordermanagement/order-table";
import { filterRows } from "./filterRows";
import { ordersData } from "./data";

type Order = {
  id: number;
  dateTime?: string;
  branch?: string;
  cashier?: string;
  paymenttype?: string;
  totalamount?: string;
  status?: string;
  action?: string;
};

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [filters, setFilters] = useState<Record<string, string>>({
    branch: "",
    paymenttype: "",
    status: "",
  });

  const filterFields: SelectField[] = useMemo(() => {
    const uniqueBranches = Array.from(new Set(ordersData.map((o) => o.branch))).filter(Boolean) as string[];
    const uniquePaymentTypes = Array.from(new Set(ordersData.map((o) => o.paymenttype))).filter(Boolean) as string[];
    const uniqueStatuses = Array.from(new Set(ordersData.map((o) => o.status))).filter(Boolean) as string[];

    return [
      {
        name: "branch",
        placeholder: "Select Branch",
        options: uniqueBranches.map((b) => ({ label: b, value: b })),
      },
      {
        name: "paymenttype",
        placeholder: "Select Payment Type",
        options: uniquePaymentTypes.map((p) => ({ label: p, value: p })),
      },
      {
        name: "status",
        placeholder: "Select Status",
        options: uniqueStatuses.map((s) => ({ label: s, value: s })),
      },
    ];
  }, []);

  const filteredOrders = useMemo(() => {
    const searched = filterRows<Order>(ordersData as Order[], query, [
      "id",
      "dateTime",
      "branch",
      "cashier",
      "paymenttype",
      "totalamount",
      "status",
    ]);

    return searched.filter((o) => {
      if (filters.branch && o.branch !== filters.branch) return false;
      if (filters.paymenttype && o.paymenttype !== filters.paymenttype) return false;
      if (filters.status && o.status !== filters.status) return false;
      return true;
    });
  }, [query, filters]);

  return (
    <DashboardLayout>
      <div className="w-full space-y-6">
        <DateRangePicker />

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
