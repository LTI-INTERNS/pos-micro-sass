"use client";

type Props = {
  onAdd?: () => void;
  onExport?: () => void;
};

export default function ActionsBar({
  onAdd,
  onExport,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
      <div className="grid grid-cols-2 gap-3">
      <button
          onClick={onAdd}
          className="w-full rounded-full bg-orange-500 py-2
                     text-xs font-semibold text-white
                     hover:bg-orange-600 transition"
        >
          Add New Cashier
        </button>
      <button
        onClick={onExport}
        className="w-full rounded-full bg-orange-500 py-2
                   text-xs font-semibold text-white
                   hover:bg-orange-600 transition"
      >
        Export CSV
      </button>
    </div>
    </div>
  );
}