"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown, X } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isToday } from "date-fns";

type Props = {
  startDate?: Date;
  endDate?: Date;
  onChange?: (start: Date | undefined, end: Date | undefined) => void;
  placeholder?: string;
};

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Select date range",
}: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<[Date | undefined, Date | undefined]>([
    startDate,
    endDate,
  ]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleChange = (dates: [Date | null, Date | null], event?: React.SyntheticEvent<any>) => {
    const [start, end] = dates;
    setRange([start ?? undefined, end ?? undefined]);
    onChange?.(start ?? undefined, end ?? undefined);

    if (start && end) setOpen(false);
  };

  const handleClear = () => {
    setRange([undefined, undefined]);
    onChange?.(undefined, undefined);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Format display value
  const displayValue = range[0] && range[1]
    ? `${isToday(range[0]) ? "Today" : format(range[0], "MMM dd, yyyy hh:mm a")} - ${format(range[1], "MMM dd, yyyy hh:mm a")}`
    : placeholder;

  return (
    <div className="relative w-full" ref={containerRef}>
      <div
        className="w-full bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <Calendar size={16} className="text-orange-500" />
          <span className="font-semibold text-gray-700">{displayValue}</span>
        </div>

        <div className="flex items-center gap-2">
          {range[0] && range[1] && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              className="p-1 rounded-full hover:bg-gray-100 transition"
            >
              <X size={14} className="text-gray-400" />
            </button>
          )}
          <ChevronDown size={18} className="text-gray-400" />
        </div>
      </div>

      {open && (
        <div className="absolute z-50 mt-1">
          <DatePicker
            selected={range[0]}
            onChange={handleChange}
            startDate={range[0]}
            endDate={range[1]}
            selectsRange
            showTimeSelect
            dateFormat="MMM dd, yyyy hh:mm a"
            inline
          />
        </div>
      )}
    </div>
  );
}
