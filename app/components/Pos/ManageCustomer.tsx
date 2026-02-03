"use client";

import { useMemo, useState } from "react";
import CommonTable, { Column } from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";
import SearchBar from "../Admin/common/Search-bar";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Props = {
  onClose: () => void;
  onAddCustomer: () => void;
  onCustomerSelected: (customer: Customer) => void; 
};

const customers: Customer[] = [
  {
    id: 1,
    name: "Kavindu Madushan",
    phone: "083894771983",
    email: "KavinduMadushan@mail.com",
  },
  {
    id: 2,
    name: "Manuga Dewhan",
    phone: "081829748835",
    email: "ManugaDewhan@mail.com",
  },
  {
    id: 3,
    name: "Malsha Ashen",
    phone: "087837829837",
    email: "MalshaAshen@mail.com",
  },
];

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
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];

    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );
  }, [search]);

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
          <CommonTable
            columns={columns}
            data={filteredCustomers}
            emptyMessage="No customers found"
            onRowClick={(customer) => {
              onCustomerSelected(customer); 
              onClose();
            }}
          />
        </div>
      )}

      <div className="flex justify-center gap-4 mt-8">
        <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
                <Buttons onClick={onClose} label="Cancel" className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50 transition-all active:scale-90"/>
                <Buttons onClick={onAddCustomer} label="New Customer" variant="primary" className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-all active:scale-90"/>
        </div>
      </div>
    </div>
  );
}