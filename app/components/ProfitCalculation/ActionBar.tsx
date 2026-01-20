"use client";

type Props = {
  onExport?: () => void;
};

export default function ActionsBar({
  onExport,
}: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
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