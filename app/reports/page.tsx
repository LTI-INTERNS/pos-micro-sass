"use client";

import DashboardLayout from "../components/Admin/common/dashboard_layout";
import StatCard from "../components/Admin/common/StatCard";
import TabSelector from "../components/Admin/common/TabSelector";
import CommonTable, { Column } from "../components/Admin/common/CommonTable";
import DateRangeBar from "../components/Admin/common/DateRangeBar";
import ExportReportPanel from "../components/Admin/reports/ExportReportPanel";
import { useCSVExport } from "../components/Admin/common/csvExport";
import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────
type SaleRow = {
  id: string;
  date: string;
  invoiceId: string;
  customer: string;
  paymentMethod: string;
  amount: string;
};

// ─────────────────────────────────────────
// Mock data
// ─────────────────────────────────────────
const STATS = [
  {
    title: "Trending Sales",
    value: "$3,450",
    percentage: "↑ 4.2%",
    trend: "up" as const,
    caption: "from last month",
  },
  {
    title: "Total expenses",
    value: "$1,000",
    percentage: "↓ 1.5%",
    trend: "down" as const,
    caption: "from last month",
  },
  {
    title: "Net Profit",
    value: "$1,290",
    percentage: "↑ 2.2%",
    trend: "up" as const,
    caption: "from last month",
  },
  {
    title: "Transactions Count",
    value: "823",
    percentage: "↑ 4.0%",
    trend: "up" as const,
    caption: "from last month",
  },
];

const CHART_TABS = [
  { id: "sales-trends", label: "Sales Trends" },
  { id: "daily-breakdown", label: "Daily Breakdown" },
  { id: "category-breakdown", label: "Category Breakdown" },
];

const SALES_TRENDS_DATA = [
  { day: "Mon, 20", sales: 160, invoices: 130 },
  { day: "Tue, 21", sales: 180, invoices: 160 },
  { day: "Wed, 22", sales: 170, invoices: 150 },
  { day: "Thu, 23", sales: 175, invoices: 155 },
  { day: "Fri, 24", sales: 165, invoices: 120 },
  { day: "Sat, 25", sales: 200, invoices: 170 },
  { day: "Sun, 26", sales: 240, invoices: 210 },
  { day: "Mon, 27", sales: 270, invoices: 230 },
  { day: "Tue, 28", sales: 300, invoices: 150 },
];

const DAILY_DATA = [
  { day: "Mon, 20", revenue: 540, expenses: 220 },
  { day: "Tue, 21", revenue: 620, expenses: 280 },
  { day: "Wed, 22", revenue: 580, expenses: 260 },
  { day: "Thu, 23", revenue: 700, expenses: 310 },
  { day: "Fri, 24", revenue: 660, expenses: 290 },
  { day: "Sat, 25", revenue: 750, expenses: 330 },
  { day: "Sun, 26", revenue: 810, expenses: 360 },
  { day: "Mon, 27", revenue: 870, expenses: 380 },
  { day: "Tue, 28", revenue: 920, expenses: 400 },
];

const CATEGORY_DATA = [
  { day: "Mon, 20", food: 200, beverage: 130, other: 80 },
  { day: "Tue, 21", food: 220, beverage: 150, other: 95 },
  { day: "Wed, 22", food: 210, beverage: 140, other: 88 },
  { day: "Thu, 23", food: 250, beverage: 160, other: 100 },
  { day: "Fri, 24", food: 240, beverage: 155, other: 92 },
  { day: "Sat, 25", food: 280, beverage: 170, other: 110 },
  { day: "Sun, 26", food: 310, beverage: 185, other: 120 },
  { day: "Mon, 27", food: 330, beverage: 200, other: 130 },
  { day: "Tue, 28", food: 360, beverage: 215, other: 140 },
];

const SALES_ROWS: SaleRow[] = Array.from({ length: 12 }, (_, i) => ({
  id: `row-${i + 1}`,
  date: `2026/01/${20 + (i % 9)}`,
  invoiceId: `INV-${String(i + 1).padStart(5, "0")}`,
  customer: ["Charlie Adams", "Jane Doe", "Ali Hassan", "Maria Kim"][i % 4],
  paymentMethod: ["Credit Card", "Cash", "GCash", "PayMaya"][i % 4],
  amount: `$${(68 + i * 12).toFixed(0)}`,
}));

const TABLE_COLUMNS: Column<SaleRow>[] = [
  { key: "date", label: "Date" },
  { key: "invoiceId", label: "Invoice ID" },
  { key: "customer", label: "Customer" },
  { key: "paymentMethod", label: "Payment Method" },
  { key: "amount", label: "Amount", align: "right" },
];

// ─────────────────────────────────────────
// Custom Tooltip
// ─────────────────────────────────────────
const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-800 text-white rounded-xl px-4 py-3 shadow-lg text-xs flex flex-col gap-1.5 min-w-[120px]">
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ background: p.color }}
            />
            {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
          </span>
          <span className="font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─────────────────────────────────────────
// Page component
// ─────────────────────────────────────────
export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("sales-trends");
  const [startDate, setStartDate] = useState<Date | undefined>(
    new Date("2018-04-25")
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date("2018-04-26")
  );
  const [selectedRow, setSelectedRow] = useState<SaleRow | null>(null);
  const exportCSV = useCSVExport<SaleRow>();

  // Chart data switches per tab
  const chartConfig = useMemo(() => {
    if (activeTab === "sales-trends") {
      return {
        data: SALES_TRENDS_DATA,
        lines: [
          { key: "sales", color: "#8167EE", name: "Sales" },
          { key: "invoices", color: "#F9716A", name: "Invoices" },
        ],
      };
    }
    if (activeTab === "daily-breakdown") {
      return {
        data: DAILY_DATA,
        lines: [
          { key: "revenue", color: "#FF5C00", name: "Revenue" },
          { key: "expenses", color: "#73CB50", name: "Expenses" },
        ],
      };
    }
    return {
      data: CATEGORY_DATA,
      lines: [
        { key: "food", color: "#FF5C00", name: "Food" },
        { key: "beverage", color: "#8167EE", name: "Beverage" },
        { key: "other", color: "#73CB50", name: "Other" },
      ],
    };
  }, [activeTab]);

  const handleGenerate = (
    format: "pdf" | "csv",
    includes: string[]
  ) => {
    if (format === "csv") {
      exportCSV(SALES_ROWS, "sales-report.csv");
    } else {
      alert(`Generating PDF with: ${includes.join(", ") || "no sections"}`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Date Range Bar */}
        <DateRangeBar
          startDate={startDate}
          endDate={endDate}
          onChange={(s, e) => {
            setStartDate(s);
            setEndDate(e);
          }}
        />

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((s) => (
            <StatCard
              key={s.title}
              title={s.title}
              value={s.value}
              percentage={s.percentage}
              trend={s.trend}
              caption={s.caption}
              showDetailButton
            />
          ))}
        </div>

        {/* Chart + Export Panel */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Chart Card */}
          <div className="flex-1 bg-white rounded-xl shadow-[0_2px_24px_rgba(25,25,28,0.04)] p-6 flex flex-col gap-4">
            {/* Tab selector */}
            <TabSelector
              tabs={CHART_TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Chart */}
            <div className="w-full" style={{ height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartConfig.data}
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
                  <Tooltip content={<CustomTooltip />} />
                  {chartConfig.lines.map((l) => (
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
          </div>

          {/* Export Report Panel */}
          <div className="w-full lg:w-[280px] shrink-0">
            <ExportReportPanel onGenerate={handleGenerate} />
          </div>
        </div>

        {/* Sales Table */}
        <CommonTable<SaleRow>
          title="Sales Report"
          data={SALES_ROWS}
          columns={TABLE_COLUMNS}
          emptyMessage="No sales found"
          selectedRowId={selectedRow?.id}
          onSelectRow={setSelectedRow}
        />
      </div>
    </DashboardLayout>
  );
}
