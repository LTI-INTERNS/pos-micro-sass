'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { overviewAnalyticsService } from '@/lib/services/analytics-service';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from '@/lib/context/formatCurrency';
import type { DateRangeParams, SalesChartData } from '@/types/analytics.types';

// Consistent palette for up to 5 product lines
const LINE_COLOURS = ['#f97316', '#6366f1', '#22c55e', '#facc15', '#ec4899'];

// Format ISO date "2024-03-15" → "Mar 15"
function fmtDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Truncate long product names for the legend
function shortName(name: string, max = 22): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

type Props = { dateRange?: DateRangeParams };

export default function SalesLineChart({ dateRange }: Props) {
  const { data: session, status } = useSession();
  const { currency, useCents }    = useCurrency();

  const role     = session?.user?.role ?? '';
  const branchId = session?.user?.branchId ?? '';
  const isCompanyWide = role === 'OWNER' || role === 'ADMIN';

  const [chartData, setChartData] = useState<SalesChartData>({ days: [], series: [] });
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: isCompanyWide ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getSalesChart(params, 5)
      .then(setChartData)
      .catch(() => setChartData({ days: [], series: [] }))
      .finally(() => setLoading(false));
  }, [status, branchId, isCompanyWide, dateRange]);

  // Transform backend shape → recharts-friendly [{day, ProductA, ProductB, …}]
  const rechartsData = chartData.days.map((iso, i) => {
    const point: Record<string, string | number> = { day: fmtDay(iso) };
    for (const s of chartData.series) point[s.variantId] = s.data[i] ?? 0;
    return point;
  });

  const isEmpty = !loading && chartData.days.length === 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold text-black">Sales</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCompanyWide ? 'All branches · top products by revenue' : 'Your branch · top products by revenue'}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-gray-400 animate-pulse">
          Loading…
        </div>
      ) : isEmpty ? (
        <div className="h-[250px] flex items-center justify-center text-sm text-gray-400">
          No sales data for this period.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={rechartsData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, currency, useCents)}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: 'none',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#f9fafb',
              }}
              formatter={(value: unknown, _key: unknown, entry) => {
                const series = chartData.series.find(s => s.variantId === entry.dataKey);
                const label  = series ? shortName(series.name, 28) : String(entry.dataKey ?? _key);
                return [formatCurrency(Number(value ?? 0), currency, useCents), label] as [string, string];
              }}
            />
            <Legend
              formatter={(_value, entry) => {
                const series = chartData.series.find(s => s.variantId === (entry as { dataKey?: string }).dataKey);
                return <span style={{ fontSize: 11, color: '#374151' }}>{series ? shortName(series.name) : _value}</span>;
              }}
            />
            {chartData.series.map((s, i) => (
              <Line
                key={s.variantId}
                type="monotone"
                dataKey={s.variantId}
                stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}