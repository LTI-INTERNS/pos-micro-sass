"use client";

import CustomerTable from "./CustomerTable";
import Buttons from "./Button";
import SearchBar from "./SearchBar";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
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

const headings = [
  { label: "CUSTOMER NAME" },
  { label: "PHONE NUMBER" },
  { label: "EMAIL ADDRESS" },
];

export default function ManageCustomer() {
  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto">
      
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Manage customer
      </h2>

      <SearchBar /> 

      <CustomerTable data={customers} headings={headings} emptyMessage= "No customers found" />

      <div className="flex justify-center mt-6">
        <div className="flex items-center border rounded-full overflow-hidden text-sm">
          <button className="px-4 py-2 text-slate-400 flex items-center gap-2">
            <img src="/Larrow.png" alt="Previous" className="w-3 h-2" />
            <span>Previous</span>
          </button>
          <span className="px-4 py-2 font-semibold text-slate-900 border-x">
            1
          </span>
          <button className="px-4 py-2 text-slate-400 flex items-center gap-2">
            <span>Next</span>
            <img src="/Rarrow.png" alt="Next" className="w-3 h-2" />
            
          </button>
        </div>
      </div>
 
      <div className="flex justify-center gap-4 mt-8">
        <Buttons cancelLabel="Cancel" otherLabel="New Customer" />
      </div>
    </div>
  );
}
