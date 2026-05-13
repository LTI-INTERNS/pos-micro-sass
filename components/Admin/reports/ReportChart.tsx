"use client";

import { useState, useEffect } from "react";
import TabSelector from "@/components/Admin/common/TabSelector";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { NameType, ValueType, Payload } from "recharts/types/component/DefaultTooltipContent";
import { analyticsService, overviewAnalyticsService } from "@/lib/services/analytics-service";
import type { SalesLine, SalesBar, SalesChartData, DateRangeParams } from "@/types/analytics.types";


const CHART_TABS = [
  { id: "sales-trends",       label: "Sales Trends"       },
  { id: "daily-breakdown",    label: "Daily Breakdown"    },
  { id: "category-breakdown", label: "Category Breakdown" },
];

type ChartLine = {
  key: string;
  color: string;
  name: string;
};

type ChartConfig = {
  data: Record<string, string | number>[];
  lines: ChartLine[];
  loading: boolean;
};

// Transform SalesLine data to chart format
function transformSalesTrendData(data: SalesLine[]): Record<string, string | number>[] {
  return data.map(item => ({
    day: item.day,
    sales: item.coffeetalk + item.lowSlow + item.coldBrew + item.eplus + item.sinergy,
    expenses: Math.round((item.coffeetalk + item.lowSlow + item.coldBrew + item.eplus + item.sinergy) * 0.4),
  }));
}

// Transform SalesBar data to chart format
function transformDailyBreakdownData(data: SalesBar[]): Record<string, string | number>[] {
  return data.map(item => ({
    day: item.hour,
    revenue: item.value,
    profit: Math.round(item.value * 0.6),
  }));
}

// Transform SalesChartData to chart format
function transformCategoryBreakdownData(data: SalesChartData): Record<string, string | number>[] {
  if (!data.days.length || !data.series.length) {
    return [];
  }
  
  return data.days.map((day, index) => {
    const row: Record<string, string | number> = { day };
    data.series.forEach(series => {
      row[series.name.toLowerCase().replace(/\s+/g, '')] = series.data[index] || 0;
    });
    return row;
  });
}

const DEFAULT_CHART_CONFIGS: Record<string, ChartConfig> = {
  "sales-trends": {
    data: [],
    lines: [
      { key: "sales",    color: "#FF5C00", name: "Sales"    },
      { key: "expenses", color: "#8167EE", name: "Expenses" },
    ],
    loading: true,
  },
  "daily-breakdown": {
    data: [],
    lines: [
      { key: "revenue", color: "#FF5C00", name: "Revenue" },
      { key: "profit",  color: "#73CB50", name: "Profit"  },
    ],
    loading: true,
  },
  "category-breakdown": {
    data: [],
    lines: [
      { key: "beverages",  color: "#FF5C00", name: "Beverages"  },
      { key: "snacks",     color: "#8167EE", name: "Snacks"     },
      { key: "drygoods",   color: "#73CB50", name: "Dry Goods"  },
      { key: "confection", color: "#F9716A", name: "Confection" },
    ],
    loading: true,
  },
};

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
  const [salesLineData, setSalesLineData] = useState<SalesLine[]>([]);
  const [salesBarData, setSalesBarData] = useState<SalesBar[]>([]);
  const [salesChartData, setSalesChartData] = useState<SalesChartData>({ days: [], series: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch all data in parallel
        const [lineData, barData, chartData] = await Promise.all([
          analyticsService.getSalesLine(),
          analyticsService.getSalesBar(),
          overviewAnalyticsService.getSalesChart(dateRange, 5),
        ]);
        
        setSalesLineData(lineData);
        setSalesBarData(barData);
        setSalesChartData(chartData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [dateRange?.startDate, dateRange?.endDate, dateRange?.branchId]);

  // Build chart config based on active tab and fetched data
  const getChartConfig = (): ChartConfig => {
    switch (activeTab) {
      case "sales-trends":
        return {
          data: transformSalesTrendData(salesLineData),
          lines: [
            { key: "sales",    color: "#FF5C00", name: "Sales"    },
            { key: "expenses", color: "#8167EE", name: "Expenses" },
          ],
          loading,
        };
      case "daily-breakdown":
        return {
          data: transformDailyBreakdownData(salesBarData),
          lines: [
            { key: "revenue", color: "#FF5C00", name: "Revenue" },
            { key: "profit",  color: "#73CB50", name: "Profit"  },
          ],
          loading,
        };
      case "category-breakdown":
        return {
          data: transformCategoryBreakdownData(salesChartData),
          lines: salesChartData.series.map((s, i) => ({
            key: s.name.toLowerCase().replace(/\s+/g, ''),
            color: ["#FF5C00", "#8167EE", "#73CB50", "#F9716A"][i % 4],
            name: s.name,
          })),
          loading,
        };
      default:
        return DEFAULT_CHART_CONFIGS["sales-trends"];
    }
  };

  const config = getChartConfig();

  return (
    <div id="report-chart-capture" className="flex-1 bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] p-6 flex flex-col gap-4">
      <TabSelector
        tabs={CHART_TABS}
        activeTab={activeTab}
        onChange={onTabChange}
      />

      {config.loading ? (
        <div className="flex-1 flex items-center justify-center h-70">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-400">Loading chart data...</span>
          </div>
        </div>
      ) : config.data.length === 0 ? (
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
            <LineChart
              data={config.data}
              margin={{ top: 8, right: 8, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#b3b3b3", fontFamily: "Poppins" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<ChartTooltip />} />
              {config.lines.map((l: ChartLine) => (
                <Line
                  key={l.key}
                  type="monotone"
                  dataKey={l.key}
                  stroke={l.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  name={l.name}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="flex items-center gap-4 flex-wrap">
        {config.lines.map((l: ChartLine) => (
          <span key={l.key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span
              className="w-3 h-0.5 rounded-full inline-block"
              style={{ background: l.color }}
            />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}
