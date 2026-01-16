"use client";

type Customer = {
  id: number;
  name: string;
  phone: string;
  promoCard: string;
  points: number;
  email: string;
  outstanding: number;
};

type Props = {
  customers: Customer[];
};

export default function CustomersTable({ customers }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="text-xm font-semibold text-gray-900">
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
              <th className="px-6 py-4 text-left font-semibold">Name</th>
              <th className="px-6 py-4 text-left font-semibold">Phone</th>
              <th className="px-6 py-4 text-left font-semibold">Promo card</th>
              <th className="px-6 py-4 text-left font-semibold">Points</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-right font-semibold">
                Outstanding <br></br>Payments
              </th>
            </tr>
          </thead>

          <tbody>
            {customers.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-5 font-medium text-gray-900">
                  {c.name}
                </td>
                <td className="px-6 py-5 text-gray-700">
                  {c.phone}
                </td>
                <td className="px-6 py-5 text-gray-700">
                  {c.promoCard}
                </td>
                <td className="px-6 py-5 font-medium text-gray-800">
                  {c.points}
                </td>
                <td className="px-6 py-5 text-gray-700">
                  {c.email}
                </td>

                <td className="px-6 py-5 text-right">
                  <div className="font-semibold text-gray-900">
                    ${c.outstanding.toLocaleString()}
                  </div>
                  <div className="text-xs font-medium text-green-500">
                    ${c.outstanding.toLocaleString()}
                  </div>
                </td>
              </tr>
            ))}

            {customers.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-8 text-center text-gray-400"
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
