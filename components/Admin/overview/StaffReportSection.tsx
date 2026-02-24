'use client';

import { useRouter } from 'next/navigation';
import StaffReportItem from '@/components/Admin/overview/StaffReportItem';
import { staffReportData } from '@/lib/mocks/overview/mockData';

export default function StaffReportSection() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-black">
          Staff wise report
        </h3>
        <button
          onClick={() => router.push('/staffmanagement')}
          className="text-sm text-orange-500 font-medium hover:underline cursor-pointer">
          View All
        </button>
      </div>

      {staffReportData.slice(0, 4).map((staff) => (
        <StaffReportItem
          key={staff.id}
          name={staff.name}
          avatar={staff.avatar}
          amount={staff.amount}
          subAmount={staff.subAmount}
        />
      ))}
    </div>
  );
}