"use client";

import StatCard from '@/components/Admin/common/StatCard';
import { Branch } from '@/lib/services/branch-service';

export default function StatCardGrid({ branches }: { branches: Branch[] }) {
  // 1. Setup Time Windows for Analytics
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  let currentPeriodCount = 0;
  let previousPeriodCount = 0;

  // 2. Count branches based on their creation dates
  branches.forEach(branch => {
    if (!branch.createdAt) return;
    const createdDate = new Date(branch.createdAt);

    if (createdDate >= thirtyDaysAgo) {
      currentPeriodCount++;
    } else if (createdDate >= sixtyDaysAgo && createdDate < thirtyDaysAgo) {
      previousPeriodCount++;
    }
  });

  // 3. Calculate Trend and Percentage Logic
  let trend: 'up' | 'down' | 'neutral' = 'neutral';
  let percentageVal = 0;

  if (previousPeriodCount === 0) {
    if (currentPeriodCount > 0) {
      percentageVal = 100; // Going from 0 to something is a 100% gain
      trend = 'up';
    } else {
      percentageVal = 0; // 0 to 0 is neutral
      trend = 'neutral';
    }
  } else {
    // Math logic: ((Current - Previous) / Previous) * 100
    percentageVal = Math.round(((currentPeriodCount - previousPeriodCount) / previousPeriodCount) * 100);
    if (percentageVal > 0) trend = 'up';
    else if (percentageVal < 0) trend = 'down';
    else trend = 'neutral';
  }

  // Formatting strings
  const formattedPercentage = `${percentageVal > 0 ? '+' : ''}${percentageVal}%`;
  const totalBranchesCount = branches.length.toString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      
      {/* CARD 1: New Branches (Dynamic) */}
      <StatCard
        title="New Branches"
        value={currentPeriodCount.toString()}
        percentage={formattedPercentage}
        trend={trend}
        caption="vs last month"
        showDetailButton={false}
      />

      {/* CARD 2: All Branches (Dynamic) */}
      <StatCard
        title="All Branches"
        value={totalBranchesCount}
        // No trend passed, so it hides automatically
        showDetailButton={false} 
      />

    </div>
  );
}