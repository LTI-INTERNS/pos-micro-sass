import Footer from "@/components/saas/common/Footer";

type Props = {
  children: React.ReactNode;
  navbar?: React.ReactNode;
};

export default function CommonLayout({ children, navbar }: Props) {
  return (
    <div className="min-h-screen flex flex-col">

      {navbar}

      <main
        className="flex-1 bg-fixed bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/saas/saasbg.png')" }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}
