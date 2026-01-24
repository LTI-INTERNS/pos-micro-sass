"use client";

type Props = {
  onAdd?: () => void;
};

export default function StaffToolbar({ onAdd }: Props) {
  return (
    <div className="flex flex-wrap gap-3 mt-4">
      <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50">
        Delete Staff
      </button>

      <button className="border border-orange-500 text-orange-500 px-4 py-2 rounded-full text-xs font-semibold hover:bg-orange-50">
        Edit Staff
      </button>

      <button
        onClick={onAdd}
        className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold"
      >
        Add New Staff
      </button>

      <button className="bg-orange-500 text-white px-5 py-2 rounded-full text-xs font-semibold">
        Export CSV
      </button>
    </div>
  );
}