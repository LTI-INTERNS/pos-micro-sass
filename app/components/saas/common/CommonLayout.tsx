import Footer from "./Footer";

type Props = {
  children: React.ReactNode;
  navbar?: React.ReactNode;
};

export default function CommonLayout({ children, navbar }: Props) {
  return (
    <div className="min-h-screen flex flex-col">

      {/* NAVBAR VARIANT */}
      {navbar}

      {/* PAGE BACKGROUND */}
      <main
        className="flex-1 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/saasbg.png')" }}
      >
        {children}
      </main>

      <Footer />
    </div>
  );
}