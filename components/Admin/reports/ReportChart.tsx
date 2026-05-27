"use client";

import { useState, useEffect } from "react";
import TabSelector from "@/components/Admin/common/TabSelector";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ComposedChart,
} from "recharts";
import type { NameType, ValueType, Payload } from "recharts/types/component/DefaultTooltipContent";
import { overviewAnalyticsService } from "@/lib/services/analytics-service";
import type {
  DateRangeParams,
  SalesBar,
  SalesChartData,
  SalesReportRow,
  TopSellingProduct,
} from "@/types/analytics.types";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";
import { format, parseISO } from "date-fns";


const CHART_TABS = [
  { id: "revenue-orders", label: "Revenue & Orders" },
  { id: "top-products", label: "Top Products" },
  { id: "product-trends", label: "Product Trends" },
];

const COLORS = ["#FF5C00", "#8167EE", "#73CB50", "#F9716A", "#06B6D4", "#64748B"];

type TooltipEntry = Payload<ValueType, NameType>;

type ChartTooltipProps = {
  active?: boolean;
  payload?: TooltipEntry[];
};

const ChartTooltip = ({ active, payload }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white rounded-xl px-4 py-3 shadow-lg text-xs flex flex-col gap-1.5 min-w-35">
      {payload.map((p: TooltipEntry) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{ background: p.color }}
            />
            {p.name}
          </span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  dateRange?: DateRangeParams;
};

export default function ReportChart({ activeTab, onTabChange, dateRange }: Props) {
  const { currency, useCents } = useCurrency();

  const [salesReport, setSalesReport] = useState<SalesReportRow[]>([]);
  const [salesBarData, setSalesBarData] = useState<SalesBar[]>([]);
  const [salesChartData, setSalesChartData] = useState<SalesChartData>({ days: [], series: [] });
  const [topProducts, setTopProducts] = useState<TopSellingProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [salesReportRows, hourlyRows, chartData, topSelling] = await Promise.all([
          overviewAnalyticsService.getSalesReport(dateRange),
          overviewAnalyticsService.getSalesBar(dateRange),
          overviewAnalyticsService.getSalesChart(dateRange, 5),
          overviewAnalyticsService.getTopSelling(dateRange, 8),
        ]);

        setSalesReport(salesReportRows);
        setSalesBarData(hourlyRows);
        setSalesChartData(chartData);
        setTopProducts(topSelling);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [dateRange]);

  const formatDayLabel = (iso: string) => {
    try {
      return format(parseISO(iso), "MMM d");
    } catch {
      return iso;
    }
  };

  const formatRangeLabel = () => {
    const start = dateRange?.startDate ? formatDayLabel(dateRange.startDate) : null;
    const end = dateRange?.endDate ? formatDayLabel(dateRange.endDate) : null;
    if (start && end) return `${start} – ${end}`;
    if (start) return `From ${start}`;
    if (end) return `Until ${end}`;
    return "All time";
  };

  const revenueOrdersData: Record<string, string | number>[] = salesReport.map((r) => ({
    day: r.day,
    revenue: r.revenue,
    orders: r.orderCount,
  }));

  const topProductsData: Record<string, string | number>[] = topProducts.map((p) => ({
    name: p.name,
    revenue: p.revenue,
    orders: p.orderCount,
  }));

  const productTrendsData: Record<string, string | number>[] =
    salesChartData.days?.length && salesChartData.series?.length
      ? salesChartData.days.map((day, index) => {
          const row: Record<string, string | number> = { day };
          salesChartData.series.forEach((s) => {
            row[s.name] = s.data[index] ?? 0;
          });
          return row;
        })
      : [];

  const currentData =
    activeTab === "revenue-orders"
      ? revenueOrdersData
      : activeTab === "top-products"
      ? topProductsData
      : productTrendsData;

  return (
    <div id="report-chart-capture" className="flex-1 bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] p-6 flex flex-col gap-4">
      <TabSelector
        tabs={CHART_TABS}
        activeTab={activeTab}
        onChange={onTabChange}
      />

      {loading ? (
        <div className="flex-1 flex items-center justify-center h-70">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading chart data...</span>
          </div>
        </div>
      ) : currentData.length === 0 ? (
        <div className="flex-1 flex items-center justify-center h-70">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-sm">No data available for the selected period</span>
          </div>
        </div>
      ) : (
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            {activeTab === "revenue-orders" ? (
              <ComposedChart
                data={revenueOrdersData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) => formatDayLabel(String(v))}
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => formatCurrency(Number(v ?? 0), currency, useCents)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Revenue") {
                      return [
                        formatCurrency(Number(value ?? 0), currency, useCents),
                        name,
                      ];
                    }
                    return [value as ValueType, name];
                  }}
                  labelFormatter={(label) => formatDayLabel(String(label))}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke={COLORS[1]} strokeWidth={2} dot={false} />
              </ComposedChart>
            ) : activeTab === "top-products" ? (
              <BarChart
                data={topProductsData}
                margin={{ top: 8, right: 8, left: 10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  interval={0}
                  angle={-12}
                  height={50}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  tickFormatter={(v) => formatCurrency(Number(v ?? 0), currency, useCents)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "Revenue") {
                      return [
                        formatCurrency(Number(value ?? 0), currency, useCents),
                        name,
                      ];
                    }
                    return [value as ValueType, name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill={COLORS[0]} radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart
                data={productTrendsData}
                margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  tickFormatter={(v) => formatDayLabel(String(v))}
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                  tickFormatter={(v) => formatCurrency(Number(v ?? 0), currency, useCents)}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value, name) => [
                    formatCurrency(Number(value ?? 0), currency, useCents),
                    name,
                  ]}
                  labelFormatter={(label) => formatDayLabel(String(label))}
                />
                <Legend />
                {salesChartData.series.map((s, idx) => (
                  <Line
                    key={s.variantId}
                    type="monotone"
                    dataKey={s.name}
                    stroke={COLORS[idx % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                    name={s.name}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {activeTab === "revenue-orders" && salesBarData.length > 0 && (
        <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-[12px] font-semibold text-slate-700">Sales by Hour</div>
            <div className="text-[11px] text-slate-500">{formatRangeLabel()}</div>
          </div>
          <div style={{ height: 120 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesBarData.map((h) => ({ hour: h.hour, value: h.value }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#b3b3b3", fontFamily: "Poppins" }} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" name="Sales" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}