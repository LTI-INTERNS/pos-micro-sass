'use client';

import { useRouter } from 'next/navigation';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { salesBarData } from '@/lib/mocks/overview/mockData';

export default function SalesBarChart() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">Sales report</h3>
        <button
          className="text-sm text-orange-500 font-medium hover:underline cursor-pointer"
          onClick={() => router.push('/reports')}>
          View All
        </button>
      </div>


      <ResponsiveContainer width="100%" height={250}>
        <BarChart
          data={salesBarData}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 10,
          }}
        >
          <XAxis
            dataKey="hour"
            interval={0}
            angle={-90}
            textAnchor="end"
            height={50}
            tickMargin={27}
            tick={{ fontSize: 14 }}
          />

          <YAxis tick={{ fontSize: 14 }} />

          <Tooltip
            contentStyle={{
              backgroundColor: '#000',
              border: 'none',
              borderRadius: '8px',
            }}
          />

          <Bar
            dataKey="value"
            fill="#93c5fd"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}