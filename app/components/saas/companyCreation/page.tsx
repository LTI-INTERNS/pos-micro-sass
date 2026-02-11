"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

import Card from "@/app/components/saas/common/FormCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField, FormErrorMessage } from "@/app/components/saas/common/FormFields";

import LogoUploadPill from "@/app/components/saas/common/LogoUploadPill";

export default function CompanyCreatePage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const [formError, setFormError] = useState("");

  const bullets = useMemo(
    () => ["Multi - branch ready", "POS + Admin Dashboard", "Secure & Scalable"],
    []
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!companyName.trim()) return setFormError("Company name is required");
    if (!address.trim()) return setFormError("Address is required");
    if (!contact.trim()) return setFormError("Contact number is required");
    if (!email.trim()) return setFormError("Email is required");

    // TODO: call API
    // logo is available in state if needed
    router.push("/company/select");
  };

  return (
    <GlassBackground backgroundImage="/saasbackground.png">
      <SplitPanelLayout
        left={
          <div className="w-full max-w-xl">
            <Card
              variant="gradient"
              padding="lg"
              className="min-h-[520px] flex flex-col justify-between"
            >
              <div className="flex justify-center">
                {/* Put your image in /public/company-illustration.png */}
                <div className="relative w-[420px] h-[270px]">
                  <Image
                    src="/creationcompanylogo.svg"
                    alt="Company illustration"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {bullets.map((b) => (
                  <div key={b} className="flex items-center gap-4">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                      ✓
                    </span>
                    <span className="text-white font-semibold">{b}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        }
        right={
          <div className="w-full max-w-lg">
            <form onSubmit={onSubmit} className="space-y-6">
              <InputField
                label="Company Name"
                placeholder="Coca Enterprises"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />

              <InputField
                label="Address"
                placeholder="used for invoices and reports"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <InputField
                label="Contact Number"
                placeholder="+94 xxxxxxxxxx"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />

              <InputField
                label="Email"
                type="email"
                placeholder="We’ll send important system alerts here"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <LogoUploadPill onFileChange={setLogo} />

              {formError && <FormErrorMessage message={formError} />}

              <PrimaryButton type="submit" className="py-4 text-base">
                Create Company
              </PrimaryButton>

            </form>
          </div>
        }
      />
    </GlassBackground>
  );
}
