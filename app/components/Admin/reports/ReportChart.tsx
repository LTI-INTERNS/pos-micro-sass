"use client";

import TabSelector from "@/app/components/Admin/common/TabSelector";
import {
  LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  SALES_TREND_DATA,
  DAILY_BREAKDOWN_DATA,
  CATEGORY_BREAKDOWN_DATA,
} from "@/app/reports/reportsMockData";


const CHART_TABS = [
  { id: "sales-trends",       label: "Sales Trends"       },
  { id: "daily-breakdown",    label: "Daily Breakdown"    },
  { id: "category-breakdown", label: "Category Breakdown" },
];

const CHART_CONFIGS: Record<
  string,
  {
    data: Record<string, string | number>[];
    lines: { key: string; color: string; name: string }[];
  }
> = {
  "sales-trends": {
    data: SALES_TREND_DATA,
    lines: [
      { key: "sales",    color: "#FF5C00", name: "Sales"    },
      { key: "expenses", color: "#8167EE", name: "Expenses" },
    ],
  },
  "daily-breakdown": {
    data: DAILY_BREAKDOWN_DATA,
    lines: [
      { key: "revenue", color: "#FF5C00", name: "Revenue" },
      { key: "profit",  color: "#73CB50", name: "Profit"  },
    ],
  },
  "category-breakdown": {
    data: CATEGORY_BREAKDOWN_DATA,
    lines: [
      { key: "beverages",  color: "#FF5C00", name: "Beverages"  },
      { key: "snacks",     color: "#8167EE", name: "Snacks"     },
      { key: "dryGoods",   color: "#73CB50", name: "Dry Goods"  },
      { key: "confection", color: "#F9716A", name: "Confection" },
    ],
  },
};


const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white rounded-xl px-4 py-3 shadow-lg text-xs flex flex-col gap-1.5 min-w-[140px]">
      {payload.map((p: any) => (
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
};

export default function ReportChart({ activeTab, onTabChange }: Props) {
  const config = CHART_CONFIGS[activeTab] ?? CHART_CONFIGS["sales-trends"];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] p-6 flex flex-col gap-4">
      <TabSelector
        tabs={CHART_TABS}
        activeTab={activeTab}
        onChange={onTabChange}
      />

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
            {config.lines.map((l) => (
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

      <div className="flex items-center gap-4 flex-wrap">
        {config.lines.map((l) => (
          <span key={l.key} className="flex items-center gap-1.5 text-[11px] text-gray-500">
            <span
              className="w-3 h-[2px] rounded-full inline-block"
              style={{ background: l.color }}
            />
            {l.name}
          </span>
        ))}
      </div>
    </div>
  );
}
