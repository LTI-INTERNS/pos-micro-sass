"use client";

import CommonTable , {Column} from "../Admin/common/CommonTable";
import Buttons from "../Admin/common/ActionButton";
import SearchBar from "../Admin/common/Search-bar";
import { useState } from "react";

type Props = {
  onClose: () => void;
  onAddCustomer: () => void;
};

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

const columns: Column<Customer>[] = [
  {
    key: "name",
    label: "CUSTOMER NAME",
    align: "left",
  },
  
  {
    key: "phone",
    label: "PHONE NUMBER ",
    align: "left",
  },
  {
    key: "email",
    label: "EMAIL ADDRESS",
    align: "left",
  },
];
export default function ManageCustomer({ onClose, onAddCustomer}: Props) {
    const [search, setSearch] = useState("");
  return (
    <div className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-auto">
      
      <h2 className="text-xl font-semibold text-slate-900 mb-6">
        Manage customer
      </h2>

      <SearchBar value={search} onChange={setSearch} placeholder="Search Customer"
 />

      <CommonTable columns={columns} data={customers} emptyMessage="No customers found" />

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
           <div className="flex justify-center gap-4 w-full max-w-md mx-auto">
                <Buttons onClick={onClose} label="Cancel" className="flex-1 px-8 py-3 rounded-full border border-orange-400 text-orange-500 font-semibold hover:bg-orange-50"/>
                <Buttons onClick={onAddCustomer} label="New Customer" variant="primary" className="flex-1 px-8 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600"/>
           </div>

       </div>
      
    </div>
  );
}
