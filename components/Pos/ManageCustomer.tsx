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
      const branchId = session?.user?.branchId;
      if (!branchId) {
        setError("No branch assigned to your account.");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await customerService.getAll(branchId);
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
  }, [session?.user, session?.user?.branchId]);

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
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Manage customer
      </h2>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email or phone"
      />

      <div className="mt-6">
        {loading ? (
          <div className="py-6 text-center text-sm text-slate-500">
            Loading customers...
          </div>
        ) : error ? (
          <div className="py-6 text-center text-sm text-red-600">{error}</div>
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

      <div className="flex justify-center gap-4 mt-8">
        <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
                <Buttons onClick={onClose} label="Cancel" className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50 transition-all active:scale-90"/>
                <Buttons onClick={onAddCustomer} label="New Customer" variant="primary" className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-90"/>
        </div>
      </div>
    </div>
  );
}