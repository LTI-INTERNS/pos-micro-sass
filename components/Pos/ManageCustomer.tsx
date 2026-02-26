"use client";

import { useState, useEffect, useCallback } from "react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import Buttons from "@/components/Admin/common/ActionButton";
import SearchBar from "@/components/Admin/common/Search-bar";
import { customerService, Customer } from "@/lib/services/customer-service";

// Shape the parent (ManageCustomersPopup) expects
type CustomerForParent = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Props = {
  onClose: () => void;
  onAddCustomer: () => void;
  onCustomerSelected: (customer: CustomerForParent) => void;
};

const columns: Column<Customer>[] = [
  { key: "name",  label: "CUSTOMER NAME"  },
  { key: "phone", label: "PHONE NUMBER"   },
  { key: "email", label: "EMAIL ADDRESS"  },
];

export default function ManageCustomer({ onClose, onAddCustomer, onCustomerSelected }: Props) {
  const [search, setSearch]       = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading]     = useState(false);

  const fetchCustomers = useCallback(async (q: string) => {
    if (!q.trim()) {
      setCustomers([]);
      return;
    }
    setLoading(true);
    try {
      const data = await customerService.search(q);
      setCustomers(data);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce search — 300 ms
  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(search), 300);
    return () => clearTimeout(timer);
  }, [search, fetchCustomers]);

  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Manage customer
      </h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email or phone"
      />

      {search.trim() !== "" && (
        <div className="mt-6">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-lg bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : (
            <CommonTable
              columns={columns}
              data={customers}
              emptyMessage="No customers found"
              onSelectRow={(customer) => {
                if (!customer) return;
                onCustomerSelected({
                  id:    0,                       // legacy numeric id — not used downstream
                  name:  customer.name,
                  phone: customer.phone,
                  email: customer.email ?? "",
                });
                onClose();
              }}
            />
          )}
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
          <Buttons
            onClick={onClose}
            label="Cancel"
            className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50 transition-all active:scale-90"
          />
          <Buttons
            onClick={onAddCustomer}
            label="New Customer"
            variant="primary"
            className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-90"
          />
        </div>
      </div>
    </div>
  );
}