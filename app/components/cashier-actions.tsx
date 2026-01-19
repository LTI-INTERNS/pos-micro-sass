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
  onExport
}: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 px-6 py-3">
      <div className="grid grid-cols-3 gap-3">
         <button
          onClick={onDeactive}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Deactive Customer
        </button>

        
        <button
          onClick={onDelete}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Delete Customer
        </button>

        <button
          onClick={onEdit}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Edit Customer
        </button>

        <button
          onClick={onAdd}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Add New Customer
        </button>
        <button
          onClick={onExport}
          className="w-full rounded-full border border-orange-400 bg-white py-2
                     text-xs font-semibold text-orange-500
                     hover:bg-orange-50 hover:shadow-sm
                     transition"
        >
          Export CSV
        </button>


      </div>
    </div>
  );
}