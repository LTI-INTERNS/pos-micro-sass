import PerformancePredictions, { PerformanceItem } from "@/app/components/Admin/aiprediction/AiPerformancePredictions";

const customerItems: PerformanceItem[] = [
  {
    id: "cust-1",
    title: "Manuga Dewhan",
    subtitle: "Customer Value & Engagement",

    primaryMetricLabel: "Lifetime Value",
    primaryMetricValueText: "LKR 12,400",
    primaryMetricSubtext: "Target: LKR 10,000",

    metricA: { label: "Engagement", valuePct: 88, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 94, tone: "green" },

    badgeText: "High Value",
    badgeTone: "green",

    calloutText: "High retention likelihood. Recommend upsell campaign to premium plan.",
  },
  {
    id: "cust-2",
    title: "Kavindu Madhushan",
    subtitle: "Customer Value & Engagement",

    primaryMetricLabel: "Monthly Revenue",
    primaryMetricValueText: "LKR 3,650",
    primaryMetricSubtext: "Target: LKR 4,000",

    metricA: { label: "Engagement", valuePct: 72, tone: "orange" },
    metricB: { label: "Satisfaction", valuePct: 86, tone: "green" },

    badgeText: "At Risk",
    badgeTone: "orange",

    calloutText: "Moderate churn risk detected. Recommend proactive outreach and onboarding refresh.",
  },
];

export default function Customers() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <PerformancePredictions title="Customer Performance Predictions" items={customerItems} />
      </div>
    </main>
  );
}
