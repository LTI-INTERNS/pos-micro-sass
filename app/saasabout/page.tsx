"use client";
import CommonLayout from "@/app/components/saas/common/CommonLayout";
import Navigation from "@/app/components/saas/landing/Navigation";
import AboutCard from "@/app/components/saas/aboutUs/AboutCard";
import FeatureRowCard from "@/app/components/saas/aboutUs/FeatureRowCard";
import { useRouter } from "next/navigation";

export default function AboutPage() {

  const router = useRouter();
  const backHref = "/";

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push(backHref);
  };

  return (
    <CommonLayout navbar={<Navigation />}>
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">

        {/* Top About Section */}
        <AboutCard className="mt-16 min-h-fit p-8 text-center border border-white/30 relative">
          <div className="space-y-4">

            <button
              onClick={handleBack}
              className="absolute left-10 text-white/80 hover:text-white text-sm flex items-center gap-2"
              type="button"
            >
              <span className="text-xl leading-none">‹</span>
              <span>Back</span>
            </button>

            <h2 className="text-white text-xl font-semibold">About</h2>

            <h1 className="text-orange-500 text-2xl font-bold">
              LankaTech Innovations
            </h1>

            <p className="text-gray-300 max-w-2xl mx-auto text-sm">
              A pioneering technology company based in Sri Lanka,
              specializing in innovative software solutions,
              AI development, and digital transformation that
              drives real business impact.
            </p>
          </div>
        </AboutCard>

        {/* Our Team / Mission / Vision */}
        <div className="grid md:grid-cols-3 gap-6">
          <AboutCard
            icon="/team.png"
            title="Our Team"
            description="A diverse team of passionate developers, designers, and AI specialists dedicated to creating innovative tech solutions that transform businesses."
          />

          <AboutCard
            icon="/mission.png"
            title="Our Mission"
            description="To accelerate Sri Lanka's digital landscape by providing world-class software and AI solutions that solve real-world problems and drive sustainable growth."
          />

          <AboutCard
            icon="/vission.png"
            title="Our Vision"
            description="To become the leading technology innovation hub in South Asia, bringing cutting-edge solutions to global markets and setting new industry standards."
          />
        </div>

        {/* Why Choose + CEO */}
        <div className="grid md:grid-cols-2 gap-6">
          <AboutCard title="Why Choose LankaTech?">
            <div className="space-y-4 text-sm text-gray-300 mt-4">

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-sm">1</span>
                  <span className="text-white font-semibold">
                    Local Expertise, Global Standards
                  </span>
                </div>
                <p className="px-8">
                  We combine deep local understanding with
                  international best practices and modern technologies.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-sm">2</span>
                  <span className="text-white font-semibold">
                    Innovation First
                  </span>
                </div>
                <p className="px-8">
                  Constantly exploring new technologies to stay ahead
                  and deliver next-generation solutions.
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 bg-orange-500 rounded-md flex items-center justify-center text-white text-sm">3</span>
                  <span className="text-white font-semibold">
                    Client-Centric Approach
                  </span>
                </div>
                <p className="px-8">
                  We work closely with clients to ensure maximum impact
                  and sustainable growth.
                </p>
              </div>

            </div>
          </AboutCard>

          <AboutCard className="mt-16 mb-16">
            <p className="text-gray-300 italic text-sm mt-10">
              &ldquo;At LankaTech Innovations, we believe in harnessing the
              power of technology to create meaningful change in how
              businesses operate and how people connect with digital
              experiences.&rdquo;
            </p>

            <p className="text-white font-semibold mt-4">
              — CEO, LankaTech Innovations
            </p>
          </AboutCard>
        </div>

        {/* Bottom Horizontal Features */}
        <div className="relative rounded-2xl backdrop-blur-md bg-black/30 border border-orange-400/50 p-8">
          <div className="grid md:grid-cols-3 gap-8">

            <FeatureRowCard
              icon="/global.png"
              title="Global Reach"
              description="International partnerships and collaborations to bring world-class solutions to your doorstep."
            />

            <FeatureRowCard
              icon="/rapid.png"
              title="Rapid Innovation"
              description="Agile development ensuring faster time-to-market and continuous improvement."
            />

            <FeatureRowCard
              icon="/quality.png"
              title="Quality Assurance"
              description="Rigorous testing and quality control processes to ensure reliable and robust solutions."
            />

          </div>
        </div>

      </div>
    </CommonLayout>
  );
}