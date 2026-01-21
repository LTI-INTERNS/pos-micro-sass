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
      <div className="grid grid-cols-2 gap-3">
      <button
          onClick={onAdd}
          className="w-full rounded-full bg-orange-500 py-2
                     text-xs font-semibold text-white
                     hover:bg-orange-600 transition"
        >
          Add New Expenses
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
  );
}