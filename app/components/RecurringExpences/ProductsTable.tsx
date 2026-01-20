"use client";

export type Product = {
  id: string;
  date: string;
  category: string;
  description: string;
  profit: string;
  payment: string;
  addedby: string;
};

type Props = {
  products: Product[];
};

export default function ProductTable({ products }: Props) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      <div className="flex items-center justify-between px-6 py-3">
        <h2 className="text-xs font-semibold text-gray-900">Products</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-gray-900">
              <th className="px-6 py-2 text-left font-normal font-semibold" >ID</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Date</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Category</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Description</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Profit</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Payment</th>
              <th className="px-6 py-2 text-left font-normal font-semibold">Added By</th>
            </tr>
          </thead>

          <tbody>
            {products.map((c) => (
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
                <td className="px-6 py-3 font-medium text-gray-900">{c.addedby}</td>
              </tr>
            ))}

          </tbody>
        </table>
      </div>
    </section>
  );
}
