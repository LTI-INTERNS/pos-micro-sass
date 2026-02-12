import Navigation from "@/app/components/saas/landing/Navigation";
import Footer from "@/app/components/saas/common/Footer";

export default function LandingPage() {
  return (
    <>
    <div className="min-h-screen bg-[url('/background.png')] bg-cover bg-center">
      <Navigation/>

      <div className="p-10">Landing Content</div>
    </div>
      <Footer/>
    </>
  );
}
