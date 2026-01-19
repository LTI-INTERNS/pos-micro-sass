'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { salesLineData } from '@/app/dashboard/mockData';

export default function SalesLineChart() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-semibold mb-4 text-black">Sales</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={salesLineData}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 14 }}
          />
          <YAxis
            tick={{ fontSize: 14 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#000',
              border: 'none',
              borderRadius: '8px',
            }}
          />

          <Line type="monotone" dataKey="coffeetalk" stroke="#6366f1" strokeWidth={2} />
          <Line type="monotone" dataKey="lowSlow" stroke="#ef4444" strokeWidth={2} />
          <Line type="monotone" dataKey="coldBrew" stroke="#facc15" strokeWidth={2} />
          <Line type="monotone" dataKey="eplus" stroke="#22c55e" strokeWidth={2} />
          <Line type="monotone" dataKey="sinergy" stroke="#a3e635" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
