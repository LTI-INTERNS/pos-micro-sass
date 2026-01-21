"use client";

export type Profit = {
  id: string;
  date: string;
  category: string;
  description: string;
  profit: string;
  payment: string;
};

type Props = {
  profits: Profit[];
};

export default function ProfitTable({ profits }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">Profits</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs table-auto">
          <thead>
            <tr className="border-b border-gray-100 text-gray-900">
              <th className="px-6 py-2 text-left font-normal font-semibold" >ID</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Date</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Category</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Description</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Profit</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Payment</th>
            </tr>
          </thead>

          <tbody>
            {profits.map((c) => (
              <tr
                key={c.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-3 font-medium text-gray-900 ">{c.id}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.date}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.category}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.description}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.profit}</td>
                <td className="px-6 py-3 font-medium text-gray-900">{c.payment}</td>
              </tr>
            ))}
            {profits.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-6 text-center text-gray-400 text-xs"
                >
                  No profits found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </section>
  );
}
