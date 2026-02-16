///company creation

"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/companyCreation/Navigation";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import {
  InputField,
  FormErrorMessage,
} from "@/app/components/saas/common/FormFields";

import LogoUploadPill from "@/app/components/saas/companyCreation/LogoUploadPill";
import StepProgressBar from "../components/saas/common/StepProgressBar";

type Errors = {
  companyName?: string;
  address?: string;
  contact?: string;
  email?: string;
  logo?: string;
};

type Touched = {
  companyName?: boolean;
  address?: boolean;
  contact?: boolean;
  email?: boolean;
  logo?: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// Sri Lanka phone formatter: 0771234567 -> +94 77 123 4567
function formatPhone(input: string) {
  let value = input.replace(/[^\d+]/g, "");

  // Convert 0XXXXXXXXX -> +94XXXXXXXXX
  if (value.startsWith("0")) value = "+94" + value.slice(1);

  // Only format if it's +94...
  if (!value.startsWith("+94")) return value;

  const digits = value.replace("+94", "");
  const p1 = digits.slice(0, 2); // 77
  const p2 = digits.slice(2, 5); // 123
  const p3 = digits.slice(5, 9); // 4567

  return `+94 ${p1}${p2 ? " " + p2 : ""}${p3 ? " " + p3 : ""}`.trim();
}

function isValidPhone(input: string) {
  const cleaned = input.replace(/\s/g, "");
  return /^\+94\d{9}$/.test(cleaned);
}

export default function CompanyCreatePage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [logo, setLogo] = useState<File | null>(null);

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [formError, setFormError] = useState("");

  const bullets = useMemo(
    () => ["Multi - branch ready", "POS + Admin Dashboard", "Secure & Scalable"],
    []
  );

  const markTouched = (field: keyof Touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = () => {
    const next: Errors = {};

    const name = companyName.trim();
    const addr = address.trim();
    const phone = contact.trim();
    const mail = email.trim();

    if (!name) next.companyName = "Company name is required";
    else if (name.length < 3)
      next.companyName = "Company name must be at least 3 characters";

    if (!addr) next.address = "Address is required";
    else if (addr.length < 6)
      next.address = "Address must be at least 6 characters";

    if (!phone) next.contact = "Contact number is required";
    else if (!isValidPhone(phone))
      next.contact = "Enter a valid number (e.g., 0771234567 or +94771234567)";

    if (!mail) next.email = "Email is required";
    else if (!emailRegex.test(mail)) next.email = "Enter a valid email address";

    // OPTIONAL logo required:
    // if (!logo) next.logo = "Company logo is required";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  useEffect(() => {
    validate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyName, address, contact, email, logo]);

  const isFormValid =
    companyName.trim().length >= 3 &&
    address.trim().length >= 6 &&
    isValidPhone(contact) &&
    emailRegex.test(email.trim());
  // if logo required:
  // && !!logo

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    setTouched({
      companyName: true,
      address: true,
      contact: true,
      email: true,
      logo: true,
    });

    const ok = validate();
    if (!ok) {
      setFormError("Please fix the highlighted fields.");
      return;
    }

    // TODO: call API
    router.push("/saasbusinessType");
  };
    const handleBack = () => {
    router.push("/saaslogin");
  };
  const handleNext = () => {
    router.push("/businesstype");
  };

  return (
 <CommonLayout navbar={<Navigation />}>
  {/* Spacer for fixed navbar */}
  <div className="h-20" />

  <StepProgressBar
    currentStep={1}
    steps={[
      { id: "1", label: "Account" },
      { id: "2", label: "Business" },
      { id: "3", label: "Subscription" },
      { id: "4", label: "Checkout" },
    ]}
  />
  <GlassBackground>
  <div className="px-4 py-8">
    <div className="mx-auto max-w-6xl rounded-3xl border">
      
      <SplitPanelLayout
        showDivider
        right={
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8">
              Company Information
            </h2>

            <form onSubmit={onSubmit} className="space-y-6">
              <InputField
                id="companyName"
                label="Company Name"
                name="companyName"
                placeholder="Coca Enterprises"
                value={companyName}
                required
                autoComplete="organization"
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  if (formError) setFormError("");
                }}
                onBlur={() => markTouched("companyName")}
                error={touched.companyName ? errors.companyName : ""}
              />

              <InputField
                id="companyAddress"
                label="Address"
                name="address"
                placeholder="Used for invoices and reports"
                value={address}
                required
                autoComplete="street-address"
                onChange={(e) => {
                  setAddress(e.target.value);
                  if (formError) setFormError("");
                }}
                onBlur={() => markTouched("address")}
                error={touched.address ? errors.address : ""}
              />

              <InputField
                id="companyContact"
                label="Contact Number"
                name="contact"
                type="tel"
                inputMode="tel"
                placeholder="+94 77 123 4567"
                value={contact}
                required
                autoComplete="tel"
                onChange={(e) => {
                  setContact(formatPhone(e.target.value));
                  if (formError) setFormError("");
                }}
                onBlur={() => markTouched("contact")}
                error={touched.contact ? errors.contact : ""}
              />

              <InputField
                id="companyEmail"
                label="Email"
                name="email"
                type="email"
                placeholder="We'll send important system alerts here"
                value={email}
                required
                autoComplete="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (formError) setFormError("");
                }}
                onBlur={() => markTouched("email")}
                error={touched.email ? errors.email : ""}
              />

              <div>
                <LogoUploadPill
                  onFileChange={(f) => {
                    setLogo(f);
                    if (formError) setFormError("");
                  }}
                />
                {touched.logo && errors.logo && (
                  <FormErrorMessage message={errors.logo} />
                )}
              </div>

              {formError && <FormErrorMessage message={formError} />}

              <PrimaryButton
                type="submit"
                disabled={!isFormValid}
                className="w-full py-4 text-base"
              >
                Create Company
              </PrimaryButton>
            </form>
          </div>
        }
        left={
          <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-xl">
            <div className="flex justify-center mb-8">
              <div className="relative w-[380px] h-[230px]">
                <Image
                  src="/creationcompanylogo.svg"
                  alt="Company illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            <div className="space-y-4">
              {bullets.map((b) => (
                <div key={b} className="flex items-center gap-4">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/40">
                    ✓
                  </span>
                  <span className="text-white font-semibold">{b}</span>
                </div>
              ))}
            </div>
          </div>
        }
      />
    </div>
  </div>
</GlassBackground>
  {/* Bottom nav */}
  <div className="mt-10 ml-50 flex justify-start text-white mb-20">
    <button onClick={handleBack} className="font-semibold hover:opacity-80 cursor-pointer">
      {"< Back"}
    </button>
  </div>
</CommonLayout>
  );
}
