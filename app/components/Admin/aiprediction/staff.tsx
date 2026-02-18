import PerformancePredictions, { PerformanceItem } from "@/app/components/Admin/common/AiPerformancePredictions";

const staffItems: PerformanceItem[] = [
  {
    id: "staff-1",
    title: "Pamara Cherera",
    subtitle: "Sales Performance & Productivity",

    primaryMetricLabel: "Sales",
    primaryMetricValueText: "LKR 48,000",
    primaryMetricSubtext: "Target: LKR 50,000",

    metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

    badgeText: "96% Productivity",
    badgeTone: "orange",

    calloutText: "Growth potential identified. Recommend skill development training.",
  },
  {
    id: "staff-2",
    title: "Dilith Malhara",
    subtitle: "Sales Performance & Productivity",

    primaryMetricLabel: "Sales",
    primaryMetricValueText: "LKR 52,000",
    primaryMetricSubtext: "Target: LKR 60,000",

    metricA: { label: "Productivity", valuePct: 104, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 99, tone: "green" },

    badgeText: "104% Productivity",
    badgeTone: "green",

    calloutText: "Strong performer. Expected to increase sales by 15–20% next quarter.",
  },
  {
    id: "staff-3",
    title: "Alsha Mashen",
    subtitle: "Sales Performance & Productivity",

    primaryMetricLabel: "Sales",
    primaryMetricValueText: "LKR 22,000",
    primaryMetricSubtext: "Target: LKR 30,000",

    metricA: { label: "Productivity", valuePct: 91, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 99, tone: "green" },

    badgeText: "91% Productivity",
    badgeTone: "orange",

    calloutText: "Growth potential identified. Recommend skill development training.",
  },
];

export default function Staff() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-5xl">
        <PerformancePredictions title="Staff Performance Predictions" items={staffItems} />
      </div>
    </main>
  );
}
