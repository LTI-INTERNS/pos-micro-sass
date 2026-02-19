import PerformancePredictions, { PerformanceItem } from "@/app/components/Admin/aiprediction/AiPerformancePredictions";

const staffItems: PerformanceItem[] = [
  {
    id: "staff-1",
    title: "Chamara Perera",
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
    title: "Malith Dilhara",
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
    title: "Malsha Ashen",
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
  {
    id: "staff-4",
    title: "Manuga Dewhan",
    subtitle: "Sales Performance & Productivity",

    primaryMetricLabel: "Sales",
    primaryMetricValueText: "LKR 28,000",
    primaryMetricSubtext: "Target: LKR 10,000",

    metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

    badgeText: "96% Productivity",
    badgeTone: "orange",

    calloutText: "Growth potential identified. Recommend skill development training.",
  },
  {
    id: "staff-5",
    title: "Kavindu Madhushan",
    subtitle: "Sales Performance & Productivity",

    primaryMetricLabel: "Sales",
    primaryMetricValueText: "LKR 78,000",
    primaryMetricSubtext: "Target: LKR 64,000",

    metricA: { label: "Productivity", valuePct: 96, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 92, tone: "green" },

    badgeText: "96% Productivity",
    badgeTone: "orange",

    calloutText: "Growth potential identified. Recommend skill development training.",
  },
];

export default function Staff() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto w-full">
        <PerformancePredictions title="Staff Performance Predictions" items={staffItems} />
      </div>
    </main>
  );
}
