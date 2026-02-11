"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";

import CompanySelectItem from "@/app/components/saas/common/CompanySelectItem";

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
      { id: "1", name: "Company Name", type: "type" },
      { id: "2", name: "Company Name", type: "type" },
      { id: "3", name: "Company Name", type: "type" },
      { id: "4", name: "Company Name", type: "type" },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState<string>(companies[0]?.id ?? "");

  return (
    <GlassBackground backgroundImage="/saasbackground.png">
      <SplitPanelLayout
        left={
          <div className="w-full max-w-lg">
            <h1 className="text-2xl font-semibold text-white mb-10">
              Select Your Company
            </h1>

            <div className="space-y-6">
              {companies.map((c) => (
                <CompanySelectItem
                  key={c.id}
                  name={c.name}
                  type={c.type}
                  selected={c.id === selectedId}
                  onClick={() => {
                    setSelectedId(c.id);
                    // If you want immediate redirect on click, uncomment:
                    // router.push(`/dashboard?company=${c.id}`);
                  }}
                />
              ))}
            </div>
          </div>
        }
        right={
          <div className="w-full flex items-center justify-center">
            <div className="w-full max-w-md">
              <PrimaryButton
                className="py-4 text-base"
                onClick={() => router.push("/components/saas/companyCreation")}
              >
                Create Company
              </PrimaryButton>

              {/* Optional: Continue button if you want selection flow */}
              {/* <div className="mt-4">
                <PrimaryButton
                  className="py-4 text-base"
                  onClick={() => router.push(`/dashboard?company=${selectedId}`)}
                >
                  Continue
                </PrimaryButton>
              </div> */}
            </div>
          </div>
        }
      />
    </GlassBackground>
  );
}
