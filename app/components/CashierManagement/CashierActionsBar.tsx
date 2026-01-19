"use client";

type Props = {
  onDeactivate?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
};

export default function CashierActionsBar({
  onDeactivate,
  onDelete,
  onEdit,
  onAdd,
  onExport,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        <button
          onClick={onDeactivate}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm transition"
        >
          Deactivate Cashier
        </button>

        <button
          onClick={onDelete}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm transition"
        >
          Delete Cashier
        </button>

        <button
          onClick={onEdit}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm transition"
        >
          Edit Cashier
        </button>

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
