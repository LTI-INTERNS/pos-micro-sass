"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navbar from '@/components/saas/landing/Navigation'
import ActionButton from "@/components/Admin/common/ActionButton";
import { InputField, TextAreaField } from "@/components/saas/common/FormFields";
import GlassBackground from "@/components/saas/common/GlassBackground";

import { MapPin, Phone, Mail } from "lucide-react";

type Errors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

type Touched = {
  name?: boolean;
  email?: boolean;
  subject?: boolean;
  message?: boolean;
};

export default function ContactUsPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const maxLen = 1000;

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [submitting, setSubmitting] = useState(false);

  const contact = useMemo(
    () => ({
      addressLines: ["No 22/A,", "Kurunduwatte, Kossinne, GeliOya", "Kandy, Sri Lanka"],
      phone: "+94 76 293 8664",
      availability: "Available 24/7",
      mail: "info@lankatechinnovations.com",
      mapEmbedSrc: "https://www.google.com/maps?q=Kandy%2C%20Sri%20Lanka&z=10&output=embed",
    }),
    []
  );

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(values?: {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
  }) {
    const v = {
      name: values?.name ?? name,
      email: values?.email ?? email,
      subject: values?.subject ?? subject,
      message: values?.message ?? message,
    };

    const next: Errors = {};
    const n = v.name.trim();
    const e = v.email.trim();
    const s = v.subject.trim();
    const m = v.message.trim();

    if (!n) next.name = "Name is required.";
    else if (n.length < 2) next.name = "Name must be at least 2 characters.";

    if (!e) next.email = "Email is required.";
    else if (!emailRegex.test(e)) next.email = "Enter a valid email address.";

    if (!s) next.subject = "Subject is required.";
    else if (s.length < 3) next.subject = "Subject must be at least 3 characters.";

    if (!m) next.message = "Message is required.";
    else if (m.length < 10) next.message = "Message must be at least 10 characters.";
    else if (m.length > maxLen) next.message = `Message cannot exceed ${maxLen} characters.`;

    return next;
  }

  const currentErrors = validate();
  const isFormValid = Object.keys(currentErrors).length === 0;

  const markTouched = (key: keyof Touched) =>
    setTouched((t) => ({ ...t, [key]: true }));

  const handleSubmit = async () => {
    setTouched({ name: true, email: true, subject: true, message: true });

    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    try {
      alert("Message sent (demo) ✅");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommonLayout navbar={<Navbar />}>
      <div className="relative">
        <div className="absolute inset-0 bg-black/60" />

    <div className="relative z-10 px-4 sm:px-8 pt-20 pb-16">
      <div className="mx-auto max-w-6xl">
        <GlassBackground>
          <div className="p-6 sm:p-10">
            <div className="flex items-center justify-between mb-10">
              <button
                onClick={() => router.back()}
                className="text-white font-semibold hover:opacity-80 cursor-pointer "
              >
                {"< Back"}
              </button>

                <div className="text-white font-bold text-[20px]">Get In Touch</div>
                <div className="w-[64px]" />
              </div>

                {/* Responsive Layout */}
                <div className="flex flex-col lg:flex-row items-stretch gap-10">

                  {/* LEFT SECTION */}
                  <div className="w-full lg:w-[420px]">

                    {/* Map */}
                    <div className="rounded-lg overflow-hidden w-full h-64 lg:h-[308px] bg-white/10">
                      <iframe
                        title="Map"
                        src={contact.mapEmbedSrc}
                        className="w-full h-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>

                  <div className="mt-8 text-white/90 text-[16px] font-semibold">Contact Information</div>

                  <div className="mt-4 space-y-4 pl-3">
                    <div className="flex items-start gap-3 text-white/80">
                      <MapPin className="mt-1 h-5 w-5 text-white/70" />
                      <div className="text-sm leading-5">
                        {contact.addressLines.map((l) => (
                          <div key={l}>{l}</div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-white/80">
                      <Phone className="mt-1 h-5 w-5 text-white/70" />
                      <div className="text-sm leading-5">
                        <div>{contact.phone}</div>
                        <div className="text-white/50">{contact.availability}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-white/80">
                      <Mail className="mt-1 h-5 w-5 text-white/70" />
                      <div className="text-sm leading-5">{contact.mail}</div>
                    </div>
                  </div>
                </div>

              {/* Divider */}
              <div className="hidden lg:flex items-center">
                <div className="h-full w-[1px] bg-white/20" />
              </div>

                {/* RIGHT */}
                <div className="w-full lg:flex-1">
                  <h2 className="text-white font-bold text-[24px]">Send us a Message</h2>

                  <div className="mt-8 space-y-6 max-w-[420px]">
                    <InputField
                      id="contact-name"
                      label="Your Name"
                      required
                      value={name}
                      autoComplete="name"
                      placeholder="Enter your full name"
                      onChange={(e) => {
                        const v = e.target.value;
                        setName(v);
                        if (touched.name) setErrors((p) => ({ ...p, ...validate({ name: v }) }));
                      }}
                      onBlur={() => {
                        markTouched("name");
                        setErrors((p) => ({ ...p, ...validate() }));
                      }}
                      error={touched.name ? (errors.name ?? currentErrors.name) : undefined}
                    />

                    <InputField
                      id="contact-email"
                      label="Email Address"
                      required
                      type="email"
                      value={email}
                      autoComplete="email"
                      placeholder="Enter your email address"
                      onChange={(e) => {
                        const v = e.target.value;
                        setEmail(v);
                        if (touched.email) setErrors((p) => ({ ...p, ...validate({ email: v }) }));
                      }}
                      onBlur={() => {
                        markTouched("email");
                        setErrors((p) => ({ ...p, ...validate() }));
                      }}
                      error={touched.email ? (errors.email ?? currentErrors.email) : undefined}
                    />

                      <InputField
                        id="contact-subject"
                        label="Subject"
                        placeholder="What is this about?"
                        required
                        value={subject}
                        onChange={(e) => {
                          const v = e.target.value;
                          setSubject(v);
                          if (touched.subject)
                            setErrors((p) => ({
                              ...p,
                              ...validate({ subject: v }),
                            }));
                        }}
                        onBlur={() => {
                          markTouched("subject");
                          setErrors((p) => ({ ...p, ...validate() }));
                        }}
                        error={
                          touched.subject
                            ? errors.subject ?? currentErrors.subject
                            : undefined
                        }
                      />
                      <div>
                      <div className="flex items-center justify-between">
                        <label className="text-white/90 text-[16px]">
                          Your Message ({Math.min(message.length, maxLen)}/{maxLen})
                        </label>
                      </div>

                      <div className="mt-3">
                        <TextAreaField
                          id="contact-message"
                          label=""
                          required
                          value={message}
                          maxLength={maxLen}
                          onChange={(e) => {
                            const v = e.target.value.slice(0, maxLen);
                            setMessage(v);
                            if (touched.message)
                              setErrors((p) => ({ ...p, ...validate({ message: v }) }));
                          }}
                          onBlur={() => {
                            markTouched("message");
                            setErrors((p) => ({ ...p, ...validate() }));
                          }}
                          error={touched.message ? (errors.message ?? currentErrors.message) : undefined}
                          placeholder="Tell us about your Thought"
                          className="min-h-[125px]"
                        />
                      </div>
                    </div>

                      <ActionButton
                        className={[
                          "w-full rounded-full py-4 text-base",
                          isFormValid && !submitting
                            ? "bg-orange-500 hover:brightness-110"
                            : "bg-orange-500/60 cursor-not-allowed",
                        ].join(" ")}
                        onClick={handleSubmit}
                        disabled={!isFormValid || submitting}
                      >
                        {submitting ? "Sending..." : "Send Message"}
                      </ActionButton>
                    </div>
                  </div>

                </div>
              </div>
            </GlassBackground>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}