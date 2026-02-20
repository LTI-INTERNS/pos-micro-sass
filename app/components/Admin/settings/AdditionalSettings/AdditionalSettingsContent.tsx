"use client";

import { useState } from "react";
import FeaturesSection from "./FeaturesSection";
import RegionalSettingsSection from "./RegionalSettingsSection";
import LoyaltySettingsSection from "./LoyaltySettingsSection";
import ReceiptCustomizationSection from "./ReceiptCustomizationSection";
import ActionButton from "@/app/components/Admin/common/ActionButton";
import { useCurrency } from "@/app/context/CurrencyContext";
import SystemImageSection from "./SystemImageSection";
import SuccessPopup from "@/app/components/Admin/common/SuccessPopup"

export default function AdditionalSettingsContent() {
  const { currency, setCurrency } = useCurrency();

  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ null here — SystemImageSection owns the default logic
  const [systemImageId, setSystemImageId] = useState<string | null>(null);
  const [systemImageUrl, setSystemImageUrl] = useState<string | null>(null);

  const [features, setFeatures] = useState({
    customerDisplays: false,
    lowStockNotifications: false,
    negativeStockAlerts: false,
    weightEmbeddedBarcodes: false,
  });

  const [country, setCountry] = useState("LK");
  const [timezone, setTimezone] = useState("Asia/Colombo");
  const [pointsEarningPercentage, setPointsEarningPercentage] = useState(5);

  const [receiptSettings, setReceiptSettings] = useState({
    headerText: "",
    footerMessage: "",
    showLogo: true,
    showTaxNumber: false,
    taxNumber: "",
  });

  const handleFeatureToggle = (featureId: string, value: boolean) => {
    setFeatures((prev) => ({ ...prev, [featureId]: value }));
  };

  const handleSave = () => {
    const settings = {
      features,
      regional: { country, currency, timezone },
      loyalty: { pointsEarningPercentage },
      receipt: receiptSettings,
      systemBackground: { imageId: systemImageId, imageUrl: systemImageUrl },
    };
    console.log("Saving settings:", settings);
    setShowSuccess(true);
  };

  return (
    <div className="w-full space-y-6">
      <FeaturesSection features={features} onToggle={handleFeatureToggle} />

      <RegionalSettingsSection
        country={country}
        currency={currency}
        timezone={timezone}
        onCountryChange={setCountry}
        onCurrencyChange={setCurrency}
        onTimezoneChange={setTimezone}
      />

      <LoyaltySettingsSection
        pointsEarningPercentage={pointsEarningPercentage}
        onPointsEarningChange={setPointsEarningPercentage}
      />

      <ReceiptCustomizationSection
        headerText={receiptSettings.headerText}
        footerMessage={receiptSettings.footerMessage}
        showLogo={receiptSettings.showLogo}
        showTaxNumber={receiptSettings.showTaxNumber}
        taxNumber={receiptSettings.taxNumber}
        onHeaderTextChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, headerText: value }))
        }
        onFooterMessageChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, footerMessage: value }))
        }
        onShowLogoChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, showLogo: value }))
        }
        onShowTaxNumberChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, showTaxNumber: value }))
        }
        onTaxNumberChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, taxNumber: value }))
        }
      />

      <SystemImageSection
        currentImageId={systemImageId}
        customImageUrl={systemImageUrl}
        onImageChange={(id, url) => {
          setSystemImageId(id);
          setSystemImageUrl(url);
        }}
      />

      <div className="flex justify-end">
        <ActionButton
          label="Save Settings"
          variant="primary"
          fullWidth={false}
          onClick={handleSave}
          className="px-8"
        />
      </div>
      <SuccessPopup
        open={showSuccess}
        title="Settings Saved!"
        subText="Your settings have been saved successfully."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}