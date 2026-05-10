import { useCurrency } from "@/lib/context/CurrencyContext";
import { formatCurrency } from "@/lib/context/formatCurrency";

type Props = {
  stats?: {
    avgCustomerValue:      number;
    predictedNewCustomers: number;
    churnRisk:             number;
  };
};

export default function StatCardGrid({ stats }: Props) {
  const { currency, useCents } = useCurrency();

  // Only render when real AI data is available — no mock fallback
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Avg Customer Value */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-medium text-slate-500">Avg. Customer Value</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">
          {formatCurrency(stats.avgCustomerValue, currency, useCents)}
        </p>
        <p className="mt-1 text-xs text-slate-400">Predicted lifetime spend</p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-orange-500 w-4/5" />
        </div>
      </div>

      {/* Predicted New Customers */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-medium text-slate-500">Predicted New Customers</p>
        <p className="mt-2 text-2xl font-extrabold text-slate-900">
          +{stats.predictedNewCustomers}
        </p>
        <p className="mt-1 text-xs text-slate-400">Expected next 30 days</p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div className="h-1.5 rounded-full bg-orange-500 w-3/4" />
        </div>
      </div>

      {/* Churn Risk */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100">
        <p className="text-sm font-medium text-slate-500">Churn Risk Customers</p>
        <p className="mt-2 text-2xl font-extrabold text-red-500">
          {stats.churnRisk}
        </p>
        <p className="mt-1 text-xs text-slate-400">Identified at risk</p>
        <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-red-400"
            style={{ width: `${Math.min(stats.churnRisk * 4, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
