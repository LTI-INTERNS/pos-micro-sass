"use client";

import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
};

type CommonTableProps<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
};

export default function CommonTable<T>({
  title,
  data,
  columns,
  emptyMessage = "No data found",
}: CommonTableProps<T>) {
  return (
    <section className="bg-white rounded-xl border border-gray-100">
      {title && (
        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-xs font-semibold text-gray-900">
            {title}
          </h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-b border-gray-100 text-gray-500">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-2 font-semibold text-${col.align ?? "left"}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-6 py-3 text-${col.align ?? "left"} text-gray-700`}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-5 text-center text-gray-400 text-xs"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
