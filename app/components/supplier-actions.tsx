"use client";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function SupplierActionsBar({
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={onDelete}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Delete Supplier
        </button>

        <button
          onClick={onEdit}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Edit Supplier
        </button>

        <button
          onClick={onAdd}
          className="w-full rounded-full bg-orange-500 py-2
                     text-xs font-semibold text-white
                     hover:bg-orange-600
                     transition"
        >
          Add New Supplier
        </button>
      </div>
    </div>
  );
}
