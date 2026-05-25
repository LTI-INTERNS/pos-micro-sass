"use client";

import CommonLayout from "@/components/saas/common/CommonLayout";
import Navigation from "@/components/saas/landing/Navigation";

import GlassPolicyLayout from "@/components/saas/common/GlassPolicyLayout";
import GlassAccordion from "@/components/saas/common/GlassAccordion";
import type { AccordionItem } from "@/components/saas/common/GlassAccordion";

import { tutorialsData } from "@/components/saas/tutorials/mockData";

// Convert normal YouTube links to embed URLs
function toEmbedUrl(url: string) {
  try {
    const u = new URL(url);

    // youtu.be/VIDEO_ID
    if (u.hostname.includes("youtu.be")) {
      const id = u.pathname.replace("/", "");
      return `https://www.youtube.com/embed/${id}`;
    }

    // youtube.com/watch?v=VIDEO_ID
    const id = u.searchParams.get("v");
    if (id) return `https://www.youtube.com/embed/${id}`;

    // already embed
    if (u.pathname.includes("/embed/")) return url;

    return url;
  } catch {
    return url;
  }
}

export default function TutorialsPage() {
  const tutorialsItems: AccordionItem[] = tutorialsData.map((item) => ({
    id: item.id,
    title: item.title,
    content: (
      <div className="space-y-3">
        {item.description && <p>{item.description}</p>}

        {item.points?.length ? (
          <ul className="list-disc pl-5 space-y-2">
            {item.points.map((point, idx) => (
              <li key={idx}>{point}</li>
            ))}
          </ul>
        ) : null}

        <div className="pt-3">
          <div className="overflow-hidden rounded-xl border border-white/20 bg-black/20">
            <div className="relative w-full aspect-video">
              <iframe
                src={toEmbedUrl(item.youtubeUrl)}
                title={item.title}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>

          <a
            href={item.youtubeUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm text-white/70 hover:text-white underline underline-offset-4"
          >
            Open on YouTube
          </a>
        </div>
      </div>
    ),
  }));

  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="pt-24 pb-10">
        <GlassPolicyLayout title="Tutorials" backHref="/">
          <GlassAccordion items={tutorialsItems} defaultOpenId="getting-started" />
        </GlassPolicyLayout>
      </div>
    </CommonLayout>
  );
}
