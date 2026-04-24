"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import CommonTable, { Column } from "@/components/Admin/common/CommonTable";
import Buttons from "@/components/Admin/common/ActionButton";
import SearchBar from "@/components/Admin/common/Search-bar";
import { customerService } from "@/lib/services/customer-service";
import type { Customer } from "@/types/customer.types";

type Props = {
  onClose: () => void;
  onAddCustomer: () => void;
  onCustomerSelected: (customer: Customer) => void;
};

const columns: Column<Customer>[] = [
  { key: "name", label: "CUSTOMER NAME" },
  { key: "phone", label: "PHONE NUMBER" },
  { key: "email", label: "EMAIL ADDRESS" },
];

export default function ManageCustomer({
  onClose,
  onAddCustomer,
  onCustomerSelected,
}: Props) {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        // No branchId passed → returns all customers across the company
        const data = await customerService.getAll();
        setCustomers(data);
      } catch {
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      void run();
    }
  }, [session?.user]);

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;

    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.email ?? "").toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [customers, search]);

  return (
    <div className="
      bg-white rounded-2xl
      w-full max-w-3xl
      mx-auto
      flex flex-col
      max-h-[90vh] sm:max-h-[85vh]
      overflow-hidden
      shadow-xl
    ">
      {/* Header */}
      <div className="px-4 sm:px-6 pt-5 pb-4 shrink-0">
        <h2 className="text-lg sm:text-xl font-semibold text-slate-900">
          Manage customer
        </h2>
      </div>

      {/* Search */}
      <div className="px-4 sm:px-6 shrink-0">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search by name, email or phone"
        />
      </div>

      {/* Table — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 mt-4 min-h-0">
        {loading ? (
          <div className="py-12 text-center text-sm text-slate-500">
            Loading customers...
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-600">{error}</div>
        ) : (
          <CommonTable
            columns={columns}
            data={filteredCustomers}
            emptyMessage="No customers found"
            onSelectRow={(customer) => {
              if (!customer) return;

              onCustomerSelected(customer);
              onClose();
            }}
          />
        )}
      </div>

      {/* Footer buttons */}
      <div className="px-4 sm:px-6 py-4 shrink-0 border-t border-slate-100">
        <div className="flex gap-3 w-full max-w-sm mx-auto">
          <Buttons
            onClick={onClose}
            label="Cancel"
            className="flex-1 px-6 py-2.5 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50 transition-all active:scale-95"
          />
          <Buttons
            onClick={onAddCustomer}
            label="New Customer"
            variant="primary"
            className="flex-1 px-6 py-2.5 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-95"
          />
        </div>
      </div>
    </div>
  );
}