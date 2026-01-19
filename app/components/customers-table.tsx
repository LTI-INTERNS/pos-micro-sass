"use client";

type Customer = {
  id: number;
  type: string;
  name: string;
  phone: number;
  email: string;
  address: string;
  regNo: string;
};

type Props = {
  customers: Customer[];
};



export default function CustomersTable({ customers }: Props) {
  const dummyCustomers: Customer[] = [
  {
    id: 1,
    type: "Supplier",
    name: "Kamal Perera",
    phone: 771234567,
    email: "kamal@gmail.com",
    address: "Colombo",
    regNo: "SUP-001",
  },
  {
    id: 2,
    type: "Supplier",
    name: "Nimal Silva",
    phone: 719876543,
    email: "nimal@gmail.com",
    address: "Kandy",
    regNo: "SUP-002",
  },
  {
    id: 3,
    type: "Supplier",
    name: "Sunil Fernando",
    phone: 761112233,
    email: "sunil@gmail.com",
    address: "Galle",
    regNo: "SUP-003",
  },
];
const tableData = customers.length > 0 ? customers : dummyCustomers;
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">
          Suppliers
        </h2>
        
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-b border-gray-100 text-gray-500">
              <th className="px-6 py-2 text-left font-semibold">ID</th>
              <th className="px-6 py-2 text-left font-semibold">Type</th>
              <th className="px-6 py-2 text-left font-semibold">Name</th>
              <th className="px-6 py-2 text-left font-semibold">Phone</th>
              <th className="px-6 py-2 text-left font-semibold">Email</th>
              <th className="px-6 py-2 text-left font-semibold">Address</th>
              <th className="px-6 py-2 text-left font-semibold">Reg No</th>
              
            </tr>
          </thead>

          <tbody>
  {tableData.map((c) => (
    <tr
      key={c.id}
      className="border-b border-gray-100 hover:bg-gray-50 transition"
    >
      <td className="px-6 py-3 font-medium text-gray-900">{c.id}</td>
      <td className="px-6 py-3 text-gray-700">{c.type}</td>
      <td className="px-6 py-3 text-gray-700">{c.name}</td>
      <td className="px-6 py-3 text-gray-700">{c.phone}</td>
      <td className="px-6 py-3 text-gray-700">{c.email}</td>
      <td className="px-6 py-3 text-gray-700">{c.address}</td>
      <td className="px-6 py-3 text-gray-700">{c.regNo}</td>
    </tr>
  ))}

  {tableData.length === 0 && (
    <tr>
      <td
        colSpan={7}
        className="px-6 py-5 text-center text-gray-400 text-xs"
      >
        No customers found
      </td>
    </tr>
  )}
</tbody>

        </table>
      </div>
    </section>
  );
}
