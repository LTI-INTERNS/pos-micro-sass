"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import GlassBackground from "@/app/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/app/components/saas/common/SplitPanelLayout";

import Card from "@/app/components/saas/common/formCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField, FormErrorMessage } from "@/app/components/saas/common/FormFields";

import LogoUploadPill from "@/app/components/saas/companyCreation/LogoUploadPill";

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
    else if (addr.length < 6) next.address = "Address must be at least 6 characters";

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

  // Auto validate silently to control button state
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

    // mark all as touched so errors appear
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

  return (
    <GlassBackground backgroundImage="/saasbg.png">
      <SplitPanelLayout
        left={
          <div className="w-full max-w-xl">
            <Card
              variant="gradient"
              padding="lg"
              className="min-h-[520px] flex flex-col justify-between"
            >
              <div className="flex justify-center">
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
              {/* Company Name */}
              <div>
                <InputField
                  label="Company Name"
                  placeholder="Coca Enterprises"
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  onBlur={() => markTouched("companyName")}
                />
                {touched.companyName && errors.companyName && (
                  <FormErrorMessage message={errors.companyName} />
                )}
              </div>

              {/* Address */}
              <div>
                <InputField
                  label="Address"
                  placeholder="used for invoices and reports"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    if (formError) setFormError("");
                  }}
                  onBlur={() => markTouched("address")}
                />
                {touched.address && errors.address && (
                  <FormErrorMessage message={errors.address} />
                )}
              </div>

              {/* Contact */}
              <div>
                <InputField
                  label="Contact Number"
                  placeholder="+94 77 123 4567"
                  value={contact}
                  onChange={(e) => {
                    setContact(formatPhone(e.target.value));
                    if (formError) setFormError("");
                  }}
                  onBlur={() => markTouched("contact")}
                />
                {touched.contact && errors.contact && (
                  <FormErrorMessage message={errors.contact} />
                )}
              </div>

              {/* Email */}
              <div>
                <InputField
                  label="Email"
                  type="email"
                  placeholder="We’ll send important system alerts here"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formError) setFormError("");
                  }}
                  onBlur={() => markTouched("email")}
                />
                {touched.email && errors.email && (
                  <FormErrorMessage message={errors.email} />
                )}
              </div>

              {/* Logo */}
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
                className={[
                  "py-4 text-base transition",
                  !isFormValid ? "opacity-50 cursor-not-allowed" : "",
                ].join(" ")}
              >
                Create Company
              </PrimaryButton>
            </form>
          </div>
        }
      />
    </GlassBackground>
  );
}
