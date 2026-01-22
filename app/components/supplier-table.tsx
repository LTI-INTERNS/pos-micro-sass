"use client";

type Supplier = {
  id: number;
  type: "Individual" | "Company";
  name: string;
  phone: number;
  email: string;
  address: string;
  regNo: string;
};

type Props = {
  suppliers: Supplier[];
};

export default function SupplierTable({ suppliers }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">
          Suppliers
        </h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-b border-gray-100 text-gray-500">
              <th className="px-6 py-2 text-left">ID</th>
              <th className="px-6 py-2 text-left">Type</th>
              <th className="px-6 py-2 text-left">Name</th>
              <th className="px-6 py-2 text-left">Phone</th>
              <th className="px-6 py-2 text-left">Email</th>
              <th className="px-6 py-2 text-left">Address</th>
              <th className="px-6 py-2 text-left">Reg No</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((s) => (
              <tr
                key={s.id}
                className="border-b border-gray-100 hover:bg-gray-50 text-black"
              >
                <td className="px-6 py-3">{s.id}</td>
                <td className="px-6 py-3">{s.type}</td>
                <td className="px-6 py-3">{s.name}</td>
                <td className="px-6 py-3">{s.phone}</td>
                <td className="px-6 py-3">{s.email}</td>
                <td className="px-6 py-3">{s.address}</td>
                <td className="px-6 py-3">{s.regNo}</td>
              </tr>
            ))}

            {suppliers.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-5 text-center text-gray-400">
                  No suppliers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
