"use client";

type Customer = {
  id: number;
  name: string;
  phone: string;
  email: string;
};

type Heading = {
  label: string;
};



type Props = {
  data: Customer[];
  headings: Heading[];
  emptyMessage: String;
};

export default function CustomerTable({ data, headings, emptyMessage }: Props) {
  return (
    <div className="border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {headings.map((heading, index) => (
              <th key={index} className="text-left px-6 py-3 font-medium">
                {heading.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((c, index) => (
            <tr
              key={c.id}
              className={`border-t ${
                index % 2 === 1 ? "bg-slate-50" : "bg-white"
              }`}
            >
              <td className="px-6 py-4 text-slate-900">{c.name}</td>
              <td className="px-6 py-4 text-slate-700">{c.phone}</td>
              <td className="px-6 py-4 text-slate-700">{c.email}</td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td
                colSpan={3}
                className="px-6 py-6 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
