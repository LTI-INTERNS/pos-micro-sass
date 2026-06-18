'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  AreaChart,
  Area,
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
import type { ValueType, NameType, Payload } from 'recharts/types/component/DefaultTooltipContent';

const LINE_COLOURS = ['#f97316', '#6366f1', '#22c55e', '#facc15', '#ec4899'];

function fmtDay(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function shortName(name: string, max = 22): string {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

function SkeletonLoader() {
  return (
    <div className="h-[300px] flex flex-col justify-end gap-1 px-2 animate-pulse">
      <div className="flex items-end gap-1 h-full w-full">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gray-100 rounded-t"
            style={{ height: `${30 + Math.sin(i * 0.8) * 20 + 40}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between mt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-2 w-10 bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}

interface CustomTooltipProps {
  active?:  boolean;
  payload?: Payload<ValueType, NameType>[];
  label?:   string;
  series:   SalesChartData['series'];
  currency: string;
  useCents: boolean;
}

function CustomTooltip({ active, payload, label, series, currency, useCents }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl p-3 min-w-[160px]">
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{label}</p>
      {payload.map((entry: Payload<ValueType, NameType>) => {
        const s    = series.find((s) => s.variantId === entry.dataKey);
        const name = s ? shortName(s.name, 28) : String(entry.dataKey ?? '');
        const key  = String(entry.dataKey ?? '');
        return (
          <div key={key} className="flex items-center gap-2 mb-1 last:mb-0">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-gray-300 flex-1 truncate">{name}</span>
            <span className="text-xs font-semibold text-white ml-2">
              {formatCurrency(Number(entry.value ?? 0), currency, useCents)}
            </span>
          </div>
        );
      })}
    </div>
  );
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

  const rechartsData = chartData.days.map((iso, i) => {
    const point: Record<string, string | number> = { day: fmtDay(iso) };
    for (const s of chartData.series) point[s.variantId] = s.data[i] ?? 0;
    return point;
  });

  const isEmpty = !loading && chartData.days.length === 0;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Revenue by Product</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {isCompanyWide ? 'All branches · top 5 products' : 'Your branch · top 5 products'}
          </p>
        </div>
        {!loading && !isEmpty && (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Live
          </div>
        )}
      </div>

      {/* Chart area */}
      <div className="flex-1 min-h-[280px]">
        {loading ? (
          <SkeletonLoader />
        ) : isEmpty ? (
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium">No data for this period</p>
            <p className="text-xs">Try selecting a different date range</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={rechartsData} margin={{ top: 5, right: 4, left: 0, bottom: 5 }}>
              <defs>
                {chartData.series.map((s, i) => (
                  <linearGradient key={s.variantId} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={LINE_COLOURS[i % LINE_COLOURS.length]} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={LINE_COLOURS[i % LINE_COLOURS.length]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                width={72}
              />
              <Tooltip
                content={
                  <CustomTooltip
                    series={chartData.series}
                    currency={currency}
                    useCents={useCents}
                  />
                }
              />
              <Legend
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ paddingTop: '12px' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(_value: string, entry: any) => (
                  <span style={{ fontSize: 11, color: '#6b7280' }}>
                    {shortName(
                      chartData.series.find(
                        (s) => s.variantId === String(entry?.dataKey ?? '')
                      )?.name ?? _value
                    )}
                  </span>
                )}
              />
              {chartData.series.map((s, i) => (
                <Area
                  key={s.variantId}
                  type="monotone"
                  dataKey={s.variantId}
                  stroke={LINE_COLOURS[i % LINE_COLOURS.length]}
                  strokeWidth={2}
                  fill={`url(#gradient-${i})`}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}