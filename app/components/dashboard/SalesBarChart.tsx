'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { salesBarData } from '@/app/dashboard/mockData';

export default function SalesBarChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">Sales report</h3>
        <button className="text-sm text-orange-500 font-medium hover:underline">
          View All
        </button>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={salesBarData} margin={{ bottom: 40 }}>
          <XAxis
            dataKey="hour"
            interval={0}                 
            angle={-90}                  
            textAnchor="end"
            height={60}
            tick={{ fontSize: 14 }}
          />
          <YAxis 
          tick={{ fontSize: 14 }}
          />
          <Tooltip />
          <Bar dataKey="value" fill="#93c5fd" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
