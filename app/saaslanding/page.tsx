import Navigation from "@/components/saas/landing/Navigation";
import HeroSection from "@/components/saas/landing/HeroSection";
import Footer from "@/components/saas/common/Footer";
import StatsBar from "@/components/saas/landing/StatsBar";
import About from "@/components/saas/landing/About";
import WhyChooseUs from "@/components/saas/landing/WhyChooseUs";
import LandingPageWithComponents from "@/components/saas/landing/landingfeature";
import GrowthSection from "@/components/saas/landing/Growth";
import Testimonials from "@/components/saas/landing/Testimonials";


export default function LandingPage() {
  return (
    <main>
      <Navigation />
      <div className="bg-[url('/saas/landing/growthtop.png')] bg-cover bg-center bg-fixed" >
    
      <section id="home">
        <HeroSection />
      </section>

      <section id="stats">
        <StatsBar />
      </section>

      <section id="about" className="scroll-mt-18">
        <About />
        <WhyChooseUs />
      </section>
      
      <section id="features" className="scroll-mt-18">
        <LandingPageWithComponents />
      </section>

      <section id="growth" className="scroll-mt-18">
        <GrowthSection />
      </section>

      <section id="testimonials" className="scroll-mt-18">
        <Testimonials />
      </section>
      
      </div>
      <Footer />
    </main>
  );
}
