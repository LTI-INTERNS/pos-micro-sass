export type TrendResult = {
  label: string;
  trend: "up" | "down";
};

export type StatSummary = {
  total: number;
  thisMonthTotal: number;
  lastMonthTotal: number;
  last30Total: number;
  prev30Total: number;
  totalTrend: TrendResult;
  monthlyTrend: TrendResult;
};

// Trend calculator 
export function calcTrend(current: number, previous: number): TrendResult {
  if (previous === 0) return { label: "+0.0%", trend: "up" };
  const diff = ((current - previous) / previous) * 100;
  return {
    label: `${diff >= 0 ? "+" : ""}${diff.toFixed(1)}%`,
    trend: diff >= 0 ? "up" : "down",
  };
}

// Main stat summary calculator 
// Pass any array that has a `date` and numeric amount key
export function calcStatSummary<T>(
  data: T[],
  dateKey: keyof T,
  amountKey: keyof T
): StatSummary {
  //  Guard: return empty summary if data is undefined/empty 
  if (!data || data.length === 0) {
    return {
      total: 0,
      thisMonthTotal: 0,
      lastMonthTotal: 0,
      last30Total: 0,
      prev30Total: 0,
      totalTrend: { label: "+0.0%", trend: "up" },
      monthlyTrend: { label: "+0.0%", trend: "up" },
    };
  }

  const now = new Date();

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);

  const sixtyDaysAgo = new Date(now);
  sixtyDaysAgo.setDate(now.getDate() - 60);

  const getAmount = (item: T) => Number(item[amountKey]);
  const getDate = (item: T) => new Date(String(item[dateKey]));

  const total = data.reduce((sum, item) => sum + getAmount(item), 0);

  const thisMonthTotal = data
    .filter((item) => {
      const d = getDate(item);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, item) => sum + getAmount(item), 0);

  const lastMonthTotal = data
    .filter((item) => {
      const d = getDate(item);
      return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((sum, item) => sum + getAmount(item), 0);

  const last30Total = data
    .filter((item) => {
      const d = getDate(item);
      return d >= thirtyDaysAgo && d <= now;
    })
    .reduce((sum, item) => sum + getAmount(item), 0);

  const prev30Total = data
    .filter((item) => {
      const d = getDate(item);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    })
    .reduce((sum, item) => sum + getAmount(item), 0);

  return {
    total,
    thisMonthTotal,
    lastMonthTotal,
    last30Total,
    prev30Total,
    totalTrend: calcTrend(last30Total, prev30Total),
    monthlyTrend: calcTrend(thisMonthTotal, lastMonthTotal),
  };
}