"use client";

export type Cashier = {
  id: string;
  name: string;
  cashierNo: string;
  totalRevenue: number;
  email: string;
  passwordMasked: string;
  pinMasked: string;
  status?: "new" | "top";
};

type Props = {
  cashiers: Cashier[];
};

export default function CashiersTable({ cashiers }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">Products</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-900">
              <th className="px-6 py-2 text-left font-normal">ID</th>
              <th className="px-6 py-2 text-left font-normal">Name</th>
              <th className="px-6 py-2 text-left font-normal">Cashier No</th>
              <th className="px-6 py-2 text-left font-normal">Total Revenue</th>
              <th className="px-6 py-2 text-left font-normal">Email</th>
              <th className="px-6 py-2 text-left font-normal">Password</th>
              <th className="px-6 py-2 text-left font-normal">Pin</th>
            </tr>
          </thead>

          <tbody>
            {cashiers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 font-medium text-gray-900">{c.id}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.cashierNo}</td>
                <td className="px-6 py-3 font-medium text-gray-900">
                  {c.totalRevenue.toLocaleString()}
                </td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.email}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.passwordMasked}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.pinMasked}</td>
              </tr>
            ))}

            {cashiers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-6 text-center text-gray-400 text-xs"
                >
                  No cashiers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
