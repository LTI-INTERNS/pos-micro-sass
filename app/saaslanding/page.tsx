import Navigation from "@/app/components/saas/landing/Navigation";
import HeroSection from "@/app/components/saas/landing/HeroSection";
import Footer from "@/app/components/saas/common/Footer";
import StatsBar from "../components/saas/landing/StatsBar";
import About from "../components/saas/landing/About";
import WhyChooseUs from "../components/saas/landing/WhyChooseUs";


export default function LandingPage() {
  return (
    <main className="bg-black">
      <Navigation />
      <HeroSection />
      <StatsBar />
      <About />
      <WhyChooseUs />
      {/* Add next components below */}
      {/* <FeaturesSection /> */}
      {/* <PricingSection /> */}
      <Footer />
    </main>
  );
}
