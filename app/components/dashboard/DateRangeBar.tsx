'use client';

import { useRef, useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

export default function DateRangeBar() {
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  
  const getTodayStart = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  };

  
  const getNow = () => {
    return new Date().toISOString().slice(0, 16);
  };

  const [fromDateTime, setFromDateTime] = useState<string>(getTodayStart());
  const [toDateTime, setToDateTime] = useState<string>(getNow());

  const formatDateTime = (value: string) => {
    const date = new Date(value);

    return date.toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-white rounded-lg px-5 py-3 flex items-center justify-between border border-gray-200 hover:bg-gray-50">
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <Calendar size={16} />
        <span>
          Date range : {formatDateTime(fromDateTime)} -{' '}
          {formatDateTime(toDateTime)}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => fromRef.current?.showPicker()}
          className="text-xs text-orange-500 font-medium hover:underline cursor-pointer"
        >
          From
        </button>

        <button
          type="button"
          onClick={() => toRef.current?.showPicker()}
          className="text-xs text-orange-500 font-medium hover:underline cursor-pointer"
        >
          To
        </button>

        <ChevronDown size={16} className="text-gray-500" />
      </div>

      
      <input
        ref={fromRef}
        type="datetime-local"
        className="hidden"
        value={fromDateTime}
        onChange={(e) => setFromDateTime(e.target.value)}
      />

      
      <input
        ref={toRef}
        type="datetime-local"
        className="hidden"
        value={toDateTime}
        onChange={(e) => setToDateTime(e.target.value)}
      />
    </div>
  );
}
