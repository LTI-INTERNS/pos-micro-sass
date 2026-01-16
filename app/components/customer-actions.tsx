"use client";

type Props = {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function CustomerActionsBar({
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-5">
      <div className="grid grid-cols-3 gap-4">
        <button
          onClick={onDelete}
          className="w-full rounded-full border border-orange-400 bg-white py-3
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Delete Customer
        </button>

        <button
          onClick={onEdit}
          className="w-full rounded-full border border-orange-400 bg-white py-3
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Edit Customer
        </button>

        <button
          onClick={onAdd}
          className="w-full rounded-full bg-orange-500 py-3
                     text-xs font-semibold text-white
                     hover:bg-orange-600
                     transition"
        >
          Add New Customer
        </button>
      </div>
    </div>
  );
}
