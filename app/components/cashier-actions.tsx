"use client";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onDeactive?: () => void;
  onExport?: () => void;
};

export default function CashierActionsBar({
  onAdd,
  onEdit,
  onDelete,
  onDeactive,
  onExport,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-4 py-3">
      <div className="flex items-center gap-5">
        
        <button
          onClick={onDeactive}
          className="flex-1 rounded-full border border-orange-400 bg-white
                     py-2 text-xs font-semibold text-orange-500
                     hover:bg-orange-50 transition"
        >
          Deactive Cashier
        </button>

        <button
          onClick={onDelete}
          className="flex-1 rounded-full border border-orange-400 bg-white
                     py-2 text-xs font-semibold text-orange-500
                     hover:bg-orange-50 transition"
        >
          Delete Cashier
        </button>

        <button
          onClick={onEdit}
          className="flex-1 rounded-full border border-orange-400 bg-white
                     py-2 text-xs font-semibold text-orange-500
                     hover:bg-orange-50 transition"
        >
          Edit Cashier
        </button>

        <button
          onClick={onAdd}
          className="flex-1 rounded-full bg-orange-500
                     py-2 text-xs font-semibold text-white
                     hover:bg-orange-600 transition"
        >
          Add New Cashier
        </button>

        <button
          onClick={onExport}
          className="flex-1 rounded-full bg-orange-500
                     py-2 text-xs font-semibold text-white
                     hover:bg-orange-600 transition"
        >
          Export CSV
        </button>

      </div>
    </div>
  );
}
