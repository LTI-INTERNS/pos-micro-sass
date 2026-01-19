"use client";

import DashboardLayout from "../components/dashboard_layout";
import DateRangeBar from "../components/CashierManagement/DateRangeBar";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      {/* Fill available height inside DashboardLayout main */}
      <div className="w-full h-full flex flex-col gap-2">
        {/* Top date range bar */}
        <DateRangeBar value="Today : Apr 25, 2018 12:00 AM - Apr 26, 2018 12:00 AM" />

        {/* Two cards share remaining screen height */}
        <div className="flex-1 grid grid-rows-2 gap-4 min-h-0">
          {/* Personal Details */}
          <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
            <div className="px-6 py-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Personal Details
              </h2>
            </div>

            
            <div className="px-6 flex-1 overflow-auto min-h-0">
              <SettingsRow label="Name" value="Nirmala Azalea" />
              <SettingsRow label="Email" value="abc@gmail.com" />
              <SettingsRow label="Address" value="No: 02, Kandy" />
              <SettingsRow label="Phone" value="071234567" />
            </div>

            <div className="px-6 py-2">
              <button
                type="button"
                className="w-full sm:w-[520px] rounded-full border border-orange-400 bg-white py-2.5
                           text-sm font-semibold text-orange-500
                           hover:bg-orange-50 transition"
                onClick={() => alert("Edit Personal Details")}
              >
                Edit Details
              </button>
            </div>
          </section>

          {/* Change Password */}
          <section className="bg-white rounded-xl border border-gray-100 flex flex-col min-h-0">
            <div className="px-6 py-3">
              <h2 className="text-sm font-semibold text-gray-900">
                Change Password
              </h2>
            </div>

            <div className="px-6 flex-1 overflow-auto min-h-0">
              <PasswordRow label="Current Password" placeholder="Enter name" />
              <PasswordRow label="New Password" placeholder="Enter name" />
              <PasswordRow label="Confirm Password" placeholder="Enter name" />
            </div>

            <div className="px-6 py-2">
              <button
                type="button"
                className="w-full sm:w-[520px] rounded-full border border-orange-400 bg-white py-2.5
                           text-sm font-semibold text-orange-500
                           hover:bg-orange-50 transition"
                onClick={() => alert("Change Password")}
              >
                Edit Details
              </button>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-12 items-center py-3 border-b border-gray-100">
      <div className="col-span-4 sm:col-span-3 text-sm font-semibold text-gray-900">
        {label}
      </div>
      <div className="col-span-8 sm:col-span-9 text-sm font-semibold text-gray-900">
        {value}
      </div>
    </div>
  );
}

function PasswordRow({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div className="grid grid-cols-12 items-center py-4 border-b border-gray-100">
      <div className="col-span-12 sm:col-span-4 text-sm font-semibold text-gray-900 mb-3 sm:mb-0">
        {label}
      </div>

      <div className="col-span-12 sm:col-span-8">
        <input
          type="password"
          placeholder={placeholder}
          className="w-full rounded-full border border-gray-200 px-6 py-2.5
                     text-sm text-gray-700 placeholder:text-gray-400
                     outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </div>
  );
}
