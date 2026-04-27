"use client";

import { useState, useEffect } from "react";
import FeaturesSection from "@/components/Admin/settings/AdditionalSettings/FeaturesSection";
import RegionalSettingsSection from "@/components/Admin/settings/AdditionalSettings/RegionalSettingsSection";
import LoyaltySettingsSection from "@/components/Admin/settings/AdditionalSettings/LoyaltySettingsSection";
import ReceiptCustomizationSection from "@/components/Admin/settings/AdditionalSettings/ReceiptCustomizationSection";
import ActionButton from "@/components/Admin/common/ActionButton";
import { useCurrency } from "@/lib/context/CurrencyContext";
import SystemImageSection from "@/components/Admin/settings/AdditionalSettings/SystemImageSection";
import SuccessPopup from "@/components/Admin/common/SuccessPopup";
import { usePosSettings } from "@/lib/context/PosSettingsContext";
import { useReceiptSettings } from "@/lib/context/ReceiptSettingsContext";
import { settingsService } from "@/lib/services/settings-service";

type LocalReceiptSettings = {
  headerText: string;
  footerMessage: string;
  showLogo: boolean;
  showTaxNumber: boolean;
  taxNumber: string;
  showCustomerDetails: boolean;
};

const defaultReceiptSettings: LocalReceiptSettings = {
  headerText: "",
  footerMessage: "",
  showLogo: true,
  showTaxNumber: false,
  taxNumber: "",
  showCustomerDetails: false,
};

export default function AdditionalSettingsContent() {
  const { currency, setCurrency, useCents, setUseCents } = useCurrency();
  const { setPosSettings } = usePosSettings();
  const { setReceiptSettings: setReceiptSettingsContext } = useReceiptSettings();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
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

  const [receiptSettings, setReceiptSettings] = useState<LocalReceiptSettings>(defaultReceiptSettings);

  // ─── Load settings from DB on mount ────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    settingsService
      .get()
      .then((s) => {
        if (!s) return; // No settings yet — keep defaults

        // Features
        setFeatures({
          customerDisplays: s.cusDisplay,
          lowStockNotifications: s.lowStock,
          negativeStockAlerts: s.negativeStock,
          weightEmbeddedBarcodes: s.weightBarcode,
        });

        // Sync to POS context
        setPosSettings({
          customerDisplayEnabled: s.cusDisplay,
          lowStockNotificationsEnabled: s.lowStock,
          negativeStockAlertsEnabled: s.negativeStock,
        });

        // Regional
        setCountry(s.country ?? "LK");
        setCurrency(s.currency ?? "LKR");
        setUseCents(s.useCents ?? true);

        // Loyalty
        setPointsEarningPercentage(Number(s.loyalty ?? 5));

        // Receipt
        const loaded: LocalReceiptSettings = {
          headerText: s.receiptHeader ?? "",
          footerMessage: s.receiptFooter ?? "",
          showLogo: s.receiptLogo ?? true,
          showTaxNumber: s.tax ?? false,
          taxNumber: s.taxNumber ?? "",
          showCustomerDetails: s.customerDetails ?? false,
        };
        setReceiptSettings(loaded);

        // Sync receipt context
        setReceiptSettingsContext({
          headerText: loaded.headerText,
          footerMessage: loaded.footerMessage,
          showLogo: loaded.showLogo,
          showTaxNumber: loaded.showTaxNumber,
          taxNumber: loaded.taxNumber,
          showCustomerDetails: loaded.showCustomerDetails,
          customerDetails: "",
        });

        // System image
        setSystemImageUrl(s.posImgUrl ?? null);
        setSystemImageId(s.posImgPublicId ?? null);
      })
      .catch((err) => {
        console.error("[Settings] Failed to load settings:", err);
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Feature toggle ─────────────────────────────────────────────────────────
  const handleFeatureToggle = (featureId: string, value: boolean) => {
    setFeatures((prev) => ({ ...prev, [featureId]: value }));
    if (featureId === "customerDisplays") setPosSettings({ customerDisplayEnabled: value });
    if (featureId === "lowStockNotifications") setPosSettings({ lowStockNotificationsEnabled: value });
    if (featureId === "negativeStockAlerts") setPosSettings({ negativeStockAlertsEnabled: value });
  };

  // ─── Save ────────────────────────────────────────────────────────────────────
  // Tax number is required when the "Show Tax Number" toggle is on
  const taxNumberRequired =
    receiptSettings.showTaxNumber && !receiptSettings.taxNumber.trim();

  const handleSave = async () => {
    if (taxNumberRequired) {
      setSaveError("Tax number is required when 'Show Tax Number' is enabled.");
      return;
    }
    setSaveError(null);
    setSaving(true);

    try {
      await settingsService.save({
        cusDisplay: features.customerDisplays,
        lowStock: features.lowStockNotifications,
        negativeStock: features.negativeStockAlerts,
        weightBarcode: features.weightEmbeddedBarcodes,
        country,
        currency,
        useCents,
        loyalty: pointsEarningPercentage,
        receiptHeader: receiptSettings.headerText,
        receiptFooter: receiptSettings.footerMessage,
        receiptLogo: receiptSettings.showLogo,
        tax: receiptSettings.showTaxNumber,
        taxNumber: receiptSettings.taxNumber,
        customerDetails: receiptSettings.showCustomerDetails,
        posImgUrl: systemImageUrl,
        posImgPublicId: systemImageId,
      });

      // Sync receipt context after save
      setReceiptSettingsContext({
        headerText: receiptSettings.headerText,
        footerMessage: receiptSettings.footerMessage,
        showLogo: receiptSettings.showLogo,
        showTaxNumber: receiptSettings.showTaxNumber,
        taxNumber: receiptSettings.taxNumber,
        showCustomerDetails: receiptSettings.showCustomerDetails,
        customerDetails: "",
      });

      setShowSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.message || "Failed to save settings.";
      setSaveError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-gray-400">
        <svg className="animate-spin w-5 h-5 mr-2 text-orange-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        Loading settings…
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <FeaturesSection features={features} onToggle={handleFeatureToggle} />

      <RegionalSettingsSection
        country={country}
        currency={currency}
        timezone={timezone}
        useCents={useCents}
        onUseCentsChange={setUseCents}
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
        showCustomerDetails={receiptSettings.showCustomerDetails}
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
        onShowCustomerDetailsChange={(value) =>
          setReceiptSettings((prev) => ({ ...prev, showCustomerDetails: value }))
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

      {saveError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {saveError}
        </div>
      )}

      <div className="flex flex-col items-end gap-2">
        {taxNumberRequired && (
          <p className="text-[12px] text-red-500">
            Tax number is required when &ldquo;Show Tax Number&rdquo; is enabled.
          </p>
        )}
        <ActionButton
          label={saving ? "Saving…" : "Save Settings"}
          variant="primary"
          fullWidth={false}
          onClick={handleSave}
          className={`px-8 ${taxNumberRequired ? "opacity-40 cursor-not-allowed" : ""}`}
        />
      </div>

      <SuccessPopup
        open={showSuccess}
        title="Settings Saved!"
        subText="Your system settings have been saved to the database."
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}