'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { overviewAnalyticsService } from '@/lib/services/analytics-service';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from '@/lib/context/formatCurrency';
import type { DateRangeParams, SalesReportRow } from '@/types/analytics.types';

// Format ISO date "2024-03-15" → "Mar 15"
function fmtDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

type Props = { dateRange?: DateRangeParams };

export default function SalesBarChart({ dateRange }: Props) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { currency, useCents }    = useCurrency();

  const role     = session?.user?.role ?? '';
  const branchId = session?.user?.branchId ?? '';
  const isCompanyWide = role === 'OWNER' || role === 'ADMIN';

  const [rows,    setRows]    = useState<SalesReportRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated') return;
    setLoading(true);

    const params: DateRangeParams = {
      ...dateRange,
      branchId: isCompanyWide ? dateRange?.branchId : branchId,
    };

    overviewAnalyticsService
      .getSalesReport(params)
      .then(setRows)
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [status, branchId, isCompanyWide, dateRange]);

  const rechartsData = rows.map(r => ({
    day:        fmtDay(r.day),
    revenue:    r.revenue,
    orderCount: r.orderCount,
  }));

  const isEmpty = !loading && rows.length === 0;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-semibold text-black">Sales report</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCompanyWide ? 'All branches · daily revenue' : 'Your branch · daily revenue'}
          </p>
        </div>
        <button
          className="text-sm text-orange-500 font-medium hover:underline cursor-pointer"
          onClick={() => router.push('/reports')}
        >
          View All
        </button>
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
          <BarChart data={rechartsData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              tickLine={false}
              axisLine={false}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
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
              formatter={(value: unknown, key: unknown) => {
                const v = typeof value === 'number' ? value : 0;
                const k = typeof key === 'string' ? key : '';
                if (k === 'revenue')    return [formatCurrency(v, currency, useCents), 'Revenue'] as [string, string];
                if (k === 'orderCount') return [String(v), 'Orders'] as [string, string];
                return [String(v), k || 'Value'] as [string, string];
              }}
            />
            <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}