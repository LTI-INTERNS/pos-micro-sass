"use client";

import React from "react";
import FormField from "@/app/components/Admin/common/FormField";

type RegionalSettingsProps = {
  country: string;
  currency: string;
  timezone: string;
  onCountryChange: (country: string) => void;
  onCurrencyChange: (currency: string) => void;
  onTimezoneChange: (timezone: string) => void;
};

const COUNTRIES = [
  { code: "LK", name: "Sri Lanka", currency: "LKR" },
  { code: "US", name: "United States", currency: "USD" },
  { code: "GB", name: "United Kingdom", currency: "GBP" },
  { code: "IN", name: "India", currency: "INR" },
  { code: "AU", name: "Australia", currency: "AUD" },
  { code: "CA", name: "Canada", currency: "CAD" },
  { code: "SG", name: "Singapore", currency: "SGD" },
  { code: "MY", name: "Malaysia", currency: "MYR" },
];

const CURRENCIES = [
  { code: "LKR", name: "Sri Lankan Rupee (LKR)" },
  { code: "USD", name: "US Dollar (USD)" },
  { code: "GBP", name: "British Pound (GBP)" },
  { code: "INR", name: "Indian Rupee (INR)" },
  { code: "AUD", name: "Australian Dollar (AUD)" },
  { code: "CAD", name: "Canadian Dollar (CAD)" },
  { code: "SGD", name: "Singapore Dollar (SGD)" },
  { code: "MYR", name: "Malaysian Ringgit (MYR)" },
  { code: "EUR", name: "Euro (EUR)" },
];

const TIMEZONES = [
  { value: "Asia/Colombo", label: "Sri Lanka Time (UTC+5:30)" },
  { value: "America/New_York", label: "Eastern Time (UTC-5)" },
  { value: "America/Chicago", label: "Central Time (UTC-6)" },
  { value: "America/Los_Angeles", label: "Pacific Time (UTC-8)" },
  { value: "Europe/London", label: "London Time (UTC+0)" },
  { value: "Asia/Dubai", label: "Dubai Time (UTC+4)" },
  { value: "Asia/Singapore", label: "Singapore Time (UTC+8)" },
  { value: "Asia/Tokyo", label: "Tokyo Time (UTC+9)" },
  { value: "Australia/Sydney", label: "Sydney Time (UTC+10)" },
];

export default function RegionalSettingsSection({
  country,
  currency,
  timezone,
  onCountryChange,
  onCurrencyChange,
  onTimezoneChange,
}: RegionalSettingsProps) {

  const handleCountryChange = (newCountry: string) => {
    onCountryChange(newCountry);

    // Auto-update currency based on country
    const selectedCountry = COUNTRIES.find((c) => c.code === newCountry);
    if (selectedCountry) {
      onCurrencyChange(selectedCountry.currency);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Regional Settings
      </h2>

      <div className="space-y-5">
        <FormField
          label="Country"
          type="dropdown"
          value={country}
          onChange={handleCountryChange}
          options={COUNTRIES.map((c) => ({
            value: c.code,
            label: c.name,
          }))}
        />

        <FormField
          label="Currency"
          type="dropdown"
          value={currency}
          onChange={onCurrencyChange}
          options={CURRENCIES.map((c) => ({
            value: c.code,
            label: c.name,
          }))}
        />

        <FormField
          label="Timezone"
          type="dropdown"
          value={timezone}
          onChange={onTimezoneChange}
          options={TIMEZONES}
        />
      </div>
    </div>
  );
}
