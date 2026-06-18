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
  Cell,
} from 'recharts';
import { overviewAnalyticsService } from '@/lib/services/analytics-service';
import { useCurrency } from '@/lib/context/CurrencyContext';
import { formatCurrency } from '@/lib/context/formatCurrency';
import type { DateRangeParams, SalesReportRow } from '@/types/analytics.types';
import type { ValueType, NameType, Payload } from 'recharts/types/component/DefaultTooltipContent';

function fmtDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SkeletonLoader() {
  return (
    <div className="h-[260px] flex flex-col justify-end gap-1 px-2 animate-pulse">
      <div className="flex items-end gap-2 h-full w-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 rounded-t"
            style={{ height: `${25 + ((i * 13) % 60)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?:   boolean;
  payload?:  Payload<ValueType, NameType>[];
  label?:    string;
  currency:  string;
  useCents:  boolean;
}

function CustomTooltip({ active, payload, label, currency, useCents }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  const revenue = payload.find((p: Payload<ValueType, NameType>) => p.dataKey === 'revenue');
  const orders  = payload.find((p: Payload<ValueType, NameType>) => p.dataKey === 'orderCount');
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3">
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{label}</p>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-400 shrink-0" />
          <span className="text-xs text-gray-300">Revenue</span>
          <span className="text-xs font-semibold text-white ml-auto">
            {formatCurrency(Number(revenue?.value ?? 0), currency, useCents)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-orange-200 shrink-0" />
          <span className="text-xs text-gray-300">Orders</span>
          <span className="text-xs font-semibold text-white ml-auto">{orders?.value ?? 0}</span>
        </div>
      </div>
    </div>
  );
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const isEmpty = !loading && rows.length === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-1">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Daily Sales</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCompanyWide ? 'All branches' : 'Your branch'}
          </p>
        </div>
        <button
          className="text-xs text-orange-500 font-medium hover:text-orange-600 transition-colors cursor-pointer"
          onClick={() => router.push('/reports')}
        >
          Full report →
        </button>
      </div>

      {/* Summary stat */}
      {!loading && !isEmpty && (
        <div className="mb-4">
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalRevenue, currency, useCents)}
          </p>
          <p className="text-xs text-gray-400">total in period</p>
        </div>
      )}

      {/* Chart */}
      <div className="flex-1 min-h-[220px]">
        {loading ? (
          <SkeletonLoader />
        ) : isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium">No sales data</p>
            <p className="text-xs">Try a different date range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rechartsData}
              margin={{ top: 5, right: 4, left: 0, bottom: 20 }}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                angle={-40}
                textAnchor="end"
                height={45}
              />
              <YAxis
                tick={{ fontSize: 10, fill: '#9ca3af' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatCurrency(v, currency, useCents)}
                width={68}
              />
              <Tooltip
                content={<CustomTooltip currency={currency} useCents={useCents} />}
                cursor={{ fill: 'rgba(249,115,22,0.06)', radius: 6 }}
              />
              <Bar
                dataKey="revenue"
                radius={[5, 5, 0, 0]}
                maxBarSize={32}
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {rechartsData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={activeIndex === index ? '#ea580c' : '#f97316'}
                    opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}