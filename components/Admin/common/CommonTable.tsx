"use client";

import React from "react";

export type Column<T> = {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T, index: number) => React.ReactNode;
};

type Props<T> = {
  title?: string;
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  selectedRowId?: string | number;
  onSelectRow?: (row: T | null) => void;
};

const ALIGN_CLASS: Record<"left" | "right" | "center", string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
};

function CommonTableInner<T extends { id?: string | number }>({
  title,
  data,
  columns,
  emptyMessage = "No data found",
  selectedRowId,
  onSelectRow,
}: Props<T>) {
  return (
    <section className="rounded-xl border border-gray-100 bg-white">
      {title && (
        <div className="px-6 py-3">
          <h2 className="text-xs font-semibold text-gray-900">{title}</h2>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-t border-b border-gray-100 text-gray-500">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-2 font-semibold ${
                    ALIGN_CLASS[col.align ?? "left"]
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, index) => {
              const isSelected = selectedRowId === row.id;

              return (
                <tr
                  key={row.id ?? index}
                  onClick={() => {
                    if (!onSelectRow) return;

                    if (isSelected) {
                      onSelectRow(null);
                    } else {
                      onSelectRow(row);
                    }
                  }}
                  className={`cursor-pointer border-b border-gray-100 hover:bg-orange-50 ${
                    isSelected ? "bg-orange-100" : ""
                  }`}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className={`px-6 py-3 ${
                        ALIGN_CLASS[col.align ?? "left"]
                      } text-gray-700`}
                    >
                      {col.render
                        ? col.render(row, index)
                        : String(
                            (row as Record<string, unknown>)[col.key as string] ?? ""
                          )}
                    </td>
                  ))}
                </tr>
              );
            })}

            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-5 text-center text-orange-400"
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

const CommonTable = React.memo(CommonTableInner) as typeof CommonTableInner;
export default CommonTable;