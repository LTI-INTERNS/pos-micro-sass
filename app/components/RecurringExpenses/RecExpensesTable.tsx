"use client";

export type RecurringExpenses = {
  id: string;
  date: string;
  category: string;
  description: string;
  payment: string;
  addedby: string;
};

type Props = {
  RecurringExpenses: RecurringExpenses[];
};

export default function RecurringExpensesTable({ RecurringExpenses }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between px-2 py-3">
        <h2 className="text-xs font-semibold text-gray-900">Recurring Expenses</h2>
      </div>

      
      <div className="overflow-x-auto">
        <div className="min-w-[100px]"> 
          <table className="w-full text-xs table-auto">
            <thead>
              <tr className="border-b border-gray-100 text-gray-900">
                <th className="px-6 py-2 text-left font-semibold">ID</th>
                <th className="px-6 py-2 text-left font-semibold">Date</th>
                <th className="px-6 py-2 text-left font-semibold">Category</th>
                <th className="px-6 py-2 text-left font-semibold">Description</th>
                <th className="px-6 py-2 text-left font-semibold">Payment</th>
                <th className="px-6 py-2 text-left font-semibold">Added By</th>
              </tr>
            </thead>

            <tbody>
              {RecurringExpenses.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-3 font-medium text-gray-900">{c.id}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.date}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.category}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.description}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.payment}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.addedby}</td>
                </tr>
              ))}
              {RecurringExpenses.length === 0 && (
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
      </div>
    </section>
  );
}
