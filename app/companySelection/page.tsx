"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";

import CompanySelectItem from "@/app/components/saas/companySelection/CompanySelectItem";

type Company = {
  id: string;
  name: string;
  type: string;
};

export default function CompanySelectPage() {
  const router = useRouter();

  // mock list (replace with API later)
  const companies: Company[] = useMemo(
    () => [
      { id: "1", name: "Company Name", type: "Retail" },
      { id: "2", name: "Company Name", type: "Restaurant / Café" },
      { id: "3", name: "Company Name", type: "Grocery / Supermarket" },
      { id: "4", name: "Company Name", type: "Retail" },
    ],
    []
  );

  // keep selected highlight
  const [selectedId, setSelectedId] = useState<string>(companies[0]?.id ?? "");

  function onSelectCompany(companyId: string) {
    setSelectedId(companyId);
    router.push(`/dashboard?company=${companyId}`);
  }

  const handleBack = () => {
    router.push("/saaslogin");
  };
  const handleNext = () => {
    router.push("/businessType");
  };

  return (
 <CommonLayout navbar={<Navigation />}>
      <div className="pt-10 pb-5 px-4">
        <GlassBackground >
            <div>
              <SplitPanelLayout
                showDivider
                leftClassName="!p-6 lg:!p-8"
                rightClassName="!p-6 lg:!p-8"
                left={
                  <div className="w-full max-w-lg">
                    <h1 className="text-3xl font-bold text-white mb-2">
                      Select Your Company
                    </h1>
                    <p className="text-sm text-white/70 mb-8">
                      Click a company to continue into your dashboard.
                    </p>

                    <div className="space-y-4">
                      {companies.map((c) => (
                        <CompanySelectItem
                          key={c.id}
                          name={c.name}
                          type={c.type}
                          selected={c.id === selectedId}
                          onClick={() => onSelectCompany(c.id)}
                        />
                      ))}
                    </div>
                  </div>
                }
                right={
                  <div className="w-full flex items-center justify-center">
                    <div className="w-full max-w-md space-y-4">
                      <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                        <h3 className="text-xl font-semibold text-white">
                          Create a new company
                        </h3>
                        <p className="mt-2 text-sm text-white/70">
                          Don’t see your company? Create one and start
                          configuring your system.
                        </p>

                        <div className="mt-6">
                          <PrimaryButton
                            className="py-4 text-base cursor-pointer"
                            onClick={() => router.push("/companycreation")}
                          >
                            Create Company
                          </PrimaryButton>
                        </div>
                      </div>

                      <div className="text-xs text-white/50 text-center">
                        Need help?{" "}
                        <span className="text-white/70">
                          info@lankatechinnovations.com
                        </span>
                      </div>
                    </div>
                  </div>
                }
              />
            </div>
          
        </GlassBackground>

      </div>
    </CommonLayout>
  );
}
