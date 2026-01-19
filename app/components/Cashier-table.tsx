"use client";

type Customer = {
  id: number;
  name: string;
  cashno: number
  totalre: number;
  email: string;
  password: string;
  pin: number;
};

type Props = {
  customers: Customer[];
};

export default function CustomersTable({ customers }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">
          Customers
        </h2>
        <button className="text-xs font-medium text-orange-500 hover:text-orange-600">
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-b border-gray-100 text-gray-500">
               <th className="px-6 py-2 text-left font-semibold">ID</th>
              <th className="px-6 py-2 text-left font-semibold">Name</th>
              <th className="px-6 py-2 text-left font-semibold">Cashier NO</th>
              <th className="px-6 py-2 text-left font-semibold">Total Revenue</th>
              <th className="px-6 py-2 text-left font-semibold">Email</th>
              <th className="px-6 py-2 text-left font-semibold">Password</th>
              <th className="px-6 py-2 text-right font-semibold">PIN</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 font-medium text-gray-900">
                  {c.name}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {c.cashno}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {c.totalre}
                </td>
                <td className="px-6 py-3 font-medium text-gray-800">
                  {c.email}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {c.password}
                </td>
                <td className="px-6 py-3 text-gray-700">
                  {c.pin}
                </td>

                {/* <td className="px-6 py-3 text-right">
                  <div className="font-semibold text-gray-900">
                    ${c.outstanding.toLocaleString()}
                  </div>
                  <div className="text-[10px] font-medium text-green-500">
                    ${c.outstanding.toLocaleString()}
                  </div>
                </td> */}
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
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