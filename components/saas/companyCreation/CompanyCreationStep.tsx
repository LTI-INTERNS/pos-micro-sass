import { useMemo, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { RegistrationData } from "@/app/companyregistration/page";
import { validateCompanyDetails } from "@/lib/services/saas-service";

import GlassBackground from "@/components/saas/common/GlassBackground";
import SplitPanelLayout from "@/components/saas/common/SplitPanelLayout";
import ActionButton from "@/components/Admin/common/ActionButton";
import {
    InputField,
    FormErrorMessage,
} from "@/components/saas/common/FormFields";
import LogoUploadPill, { LogoUploadResult } from "@/components/saas/companyCreation/LogoUploadPill";

type Errors = {
    companyName?: string;
    address?: string;
    contact?: string;
    email?:  string;
};

type Touched = {
    companyName?: boolean;
    address?: boolean;
    contact?: boolean;
    email?: boolean;
};

type Props = {
    data:   RegistrationData;
    onNext: (data: Partial<RegistrationData>) => void;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

function formatPhone(input: string) {
    let value = input.replace(/[^\d+]/g, "");
    if (value.startsWith("0")) value = "+94" + value.slice(1);
    if (!value.startsWith("+94")) return value;

    const digits = value.replace("+94", "");
    const p1 = digits.slice(0, 2);
    const p2 = digits.slice(2, 5);
    const p3 = digits.slice(5, 9);

    return `+94 ${p1}${p2 ? " " + p2 : ""}${p3 ? " " + p3 : ""}`.trim();
}

function isValidPhone(input: string) {
    return /^\+94\d{9}$/.test(input.replace(/\s/g, ""));
}


export default function CompanyCreationStep({ data, onNext }: Props) {
    const [companyName, setCompanyName] = useState(data.companyName);
    const [address, setAddress] = useState(data.address);
    const [contact, setContact] = useState(data.contact);
    const [email, setEmail] = useState(data.email);
    const [logoFile, setLogoFile] = useState<File | null>(data.logo);
    const [logoUrl,       setLogoUrl]       = useState<string>(data.logoUrl ?? "");
    const [logoPublicId,  setLogoPublicId]  = useState<string>(data.logoPublicId ?? "");
    const [logoUploading, setLogoUploading] = useState(false);
    const [checkingDetails, setCheckingDetails] = useState(false);

    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});
    const [formError, setFormError] = useState("");

    const bullets = useMemo(
        () => ["Multi - branch ready", "POS + Admin Dashboard", "Secure & Scalable"],
        []
    );

    const markTouched = (field: keyof Touched) =>
        setTouched((prev) => ({ ...prev, [field]: true }));

    const validate = useCallback((): boolean => {
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
                             next.contact = "Enter a valid number (e.g. 0771234567 or +94771234567)";

        if (!mail) next.email = "Email is required";
        else if (!emailRegex.test(mail)) next.email = "Enter a valid email address";

        setErrors(next);
        return Object.keys(next).length === 0;
    }, [companyName, address, contact, email]);

    useEffect(() => {validate();}, [validate]);

    const isFormValid =
        companyName.trim().length >= 3 &&
        address.trim().length >= 6 &&
        isValidPhone(contact) &&
        emailRegex.test(email.trim());

    const handleLogoUploadStart = () => setLogoUploading(true);

    const handleLogoUploadDone = (result: LogoUploadResult) => {
        setLogoFile(result.file);
        setLogoUrl(result.uploadedUrl);
        setLogoPublicId(result.publicId);
        setLogoUploading(false);
        if (formError) setFormError("");
    };

    const handleLogoClear = () => {
        setLogoFile(null);
        setLogoUrl("");
        setLogoPublicId("");
        setLogoUploading(false);
    };

    const applyServerValidationError = (code: string | undefined, message: string) => {
        if (code === "DUPLICATE_EMAIL" || code === "INVALID_EMAIL") {
            setTouched((prev) => ({ ...prev, email: true }));
            setErrors((prev) => ({ ...prev, email: message }));
            setFormError("Please fix the highlighted fields.");
            return;
        }

        if (code === "DUPLICATE_PHONE" || code === "INVALID_PHONE") {
            setTouched((prev) => ({ ...prev, contact: true }));
            setErrors((prev) => ({ ...prev, contact: message }));
            setFormError("Please fix the highlighted fields.");
            return;
        }

        if (code === "DUPLICATE_COMPANY") {
            setTouched((prev) => ({ ...prev, companyName: true, address: true }));
            setErrors((prev) => ({
                ...prev,
                companyName: "This company name and address are already registered.",
                address: "This address is already used for the same company name.",
            }));
            setFormError(message);
            return;
        }

        setFormError(message);
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        setTouched({
            companyName: true,
            address: true,
            contact: true,
            email: true,
        });

        const ok = validate();
        if (!ok) {
            setFormError("Please fix the highlighted fields.");
            return;
        }

        if (logoUploading) {
            setFormError("Please wait for the logo upload to complete.");
            return;
        }

        setCheckingDetails(true);
        const validation = await validateCompanyDetails({
            companyName,
            address,
            contactNumber: contact,
            email,
        });
        setCheckingDetails(false);

        if (!validation.ok) {
            applyServerValidationError(validation.code, validation.message);
            return;
        }

        onNext({
            companyName,
            address,
            contact,
            email,
            logo:        logoFile,
            logoUrl,
            logoPublicId,
        });
    };

    return (
        <>
            <GlassBackground>
                <div className="px-4 py-8">
                    <SplitPanelLayout
                        showDivider
                        right={
                            <div className="w-full max-w-md mx-auto">
                                <h2 className="text-2xl text-center font-bold text-white mb-8">
                                    Company Creation
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

                                    <LogoUploadPill
                                        initialPreviewUrl={logoUrl}
                                        initialFileName={logoFile?.name ?? "Company logo"}
                                        onUploadStart={handleLogoUploadStart}
                                        onUploadDone={handleLogoUploadDone}
                                        onClear={handleLogoClear}
                                    />

                                    {formError && <FormErrorMessage message={formError} />}

                                    <ActionButton
                                        type="submit"
                                        disabled={!isFormValid || logoUploading || checkingDetails}
                                        className="w-full py-4 text-base"
                                    >
                                        {logoUploading ? "Uploading logo…" : checkingDetails ? "Checking details…" : "Next"}
                                    </ActionButton>
                                </form>
                            </div>
                        }
                        left={
                            <div className="hidden md:block">
                                <div className="rounded-2xl bg-gradient-to-b from-orange-500 to-orange-600 p-8 sm:p-10 text-white shadow-xl">
                                    <div className="flex justify-center mb-8">
                                        <div className="relative w-full max-w-[380px] h-48 md:h-[230px] mx-auto">
                                            <Image
                                                src="/saas/creationcompanylogo.svg"
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
                            </div>
                        }
                    />
                </div>
            </GlassBackground>
        </>
    );
}