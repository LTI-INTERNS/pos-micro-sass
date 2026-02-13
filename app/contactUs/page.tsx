"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navbar from "@/app/components/saas/common/Navbar";
import Card from "@/app/components/saas/common/formCard";
import PrimaryButton from "@/app/components/saas/common/PrimaryButton";
import { InputField, TextAreaField } from "@/app/components/saas/common/FormFields";

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

  const [name, setName] = useState("John Smith");
  const [email, setEmail] = useState("example@gmail.com");
  const [subject, setSubject] = useState("subject");
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
    <CommonLayout
      navbar={
        <Navbar
          middleContent={
            <div className="hidden md:flex items-center gap-8 text-white/90">
              <span className="hover:text-white cursor-pointer">Home</span>
              <span className="hover:text-white cursor-pointer">About</span>
              <span className="hover:text-white cursor-pointer">Features</span>
              <span className="hover:text-white cursor-pointer">Growth</span>
              <span className="hover:text-white cursor-pointer">Testimonials</span>
            </div>
          }
          rightContent={
            <div className="flex items-center gap-3">
              <button className="rounded-full border border-orange-400 px-6 py-2 text-orange-200 font-semibold hover:bg-white/10">
                Sign In
              </button>
              <button className="rounded-full bg-orange-500 px-6 py-2 text-white font-semibold hover:brightness-110">
                Sign Up
              </button>
            </div>
          }
        />
      }
    >
      <div className="relative">
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 px-4 sm:px-8 pt-28 pb-16">
          <div className="mx-auto max-w-6xl">
            <Card variant="glass" padding="lg" radius="2xl" elevation="lg" className="w-full">
              <div className="flex items-center justify-between mb-10">
                <button
                  onClick={() => router.back()}
                  className="text-white font-semibold hover:opacity-80"
                >
                  {"< Back"}
                </button>

                <div className="text-white font-bold text-[20px]">Get In Touch</div>
                <div className="w-[64px]" />
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-[59px]">
                {/* LEFT */}
                <div className="w-full md:w-[417px]">
                  <div className="rounded-lg overflow-hidden w-full h-[308px] bg-white/10">
                    <iframe
                      title="Map"
                      src={contact.mapEmbedSrc}
                      className="w-full h-full"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>

                  <div className="mt-8 text-white/90 text-[16px]">Contact Information</div>

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
                <div className="hidden md:flex items-center">
                  <div className="h-full w-1 bg-[#B0B0B0]/80 rounded-full" />
                </div>

                {/* RIGHT */}
                <div className="w-full md:flex-1">
                  <h2 className="text-white font-bold text-[24px]">Send Us a Message</h2>

                  <div className="mt-8 space-y-6 max-w-[420px]">
                    <InputField
                      id="contact-name"
                      label="Your Name*"
                      variant="solid"
                      value={name}
                      autoComplete="name"
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
                      label="Email Address*"
                      type="email"
                      variant="solid"
                      value={email}
                      autoComplete="email"
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
                      label="Subject*"
                      variant="solid"
                      value={subject}
                      onChange={(e) => {
                        const v = e.target.value;
                        setSubject(v);
                        if (touched.subject) setErrors((p) => ({ ...p, ...validate({ subject: v }) }));
                      }}
                      onBlur={() => {
                        markTouched("subject");
                        setErrors((p) => ({ ...p, ...validate() }));
                      }}
                      error={touched.subject ? (errors.subject ?? currentErrors.subject) : undefined}
                    />

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="text-white/90 text-[16px]">
                          Your Message* ({Math.min(message.length, maxLen)}/{maxLen})
                        </label>
                      </div>

                      <div className="mt-3">
                        <TextAreaField
                          id="contact-message"
                          label=""
                          variant="solid"
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

                    <PrimaryButton
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
                    </PrimaryButton>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </CommonLayout>
  );
}
