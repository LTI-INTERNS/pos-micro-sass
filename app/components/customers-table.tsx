"use client";
type Customer= {
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
    <section className="bg-white rounded-xl border border-gray-200">
      <div className="flex justify-between items-center px-6 py-4">
        <h2 className="text-lg font-semibold">Customers</h2>
        <button className="text-sm text-orange-500 font-medium">
          View All
        </button>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-t border-b text-gray-500">
            <th className="px-6 py-4 text-left">Name</th>
            <th className="px-6 py-4 text-left">Phone</th>
            <th className="px-6 py-4 text-left">Promo card</th>
            <th className="px-6 py-4 text-left">Points</th>
            <th className="px-6 py-4 text-left">Email</th>
            <th className="px-6 py-4 text-right">
              Outstanding Payments
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="px-6 py-4 font-medium">{c.name}</td>
              <td className="px-6 py-4">{c.phone}</td>
              <td className="px-6 py-4">{c.promoCard}</td>
              <td className="px-6 py-4">{c.points}</td>
              <td className="px-6 py-4">{c.email}</td>

              <td className="px-6 py-4 text-right font-semibold">
                ${c.outstanding.toLocaleString()}
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
    </section>
  );
}