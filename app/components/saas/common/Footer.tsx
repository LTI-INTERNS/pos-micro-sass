"use client";

import Image from "next/image";
import Link from "next/link"
import { Facebook, Music2, ArrowUp, Linkedin } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="relative w-full overflow-hidden text-white bg-gradient-to-r from-[#eec49a]/50 via-[#7a4312]/35 to-[#995518]/10">
      
      {/* Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/footer.png"
          alt="Footer Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 backdrop-blur-md bg-black/40" />
      </div>

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-16">

        {/* UPDATED ALIGNMENT SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10">

          {/* LEFT - LOGO */}
          <div>
            <Link href="https://lankatechinnovations.com/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={200}
                height={50}
                className="w-auto h-10"
              />
            </Link>
          </div>

          {/* RIGHT SIDE SECTIONS */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-10">

            {/* PRODUCTS */}
            <div>
              <h4 className="font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">
                  <Link href="/tutorials" className="hover:text-white transition">
                    Tutorials
                  </Link>
                </li>
                <li className="hover:text-white cursor-pointer">
                  <Link href="/pricing" className="hover:text-white transition">
                    Pricing
                  </Link>
                  </li>
              </ul>
            </div>

            {/* COMPANY */}
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="hover:text-white cursor-pointer">
                    <Link href="/saasabout" className="hover:text-white transition">
                    About Us
                    </Link>
                  </li>
                <li className="hover:text-white cursor-pointer">
                  <Link href="/contactus" className="hover:text-white transition">
                    Contact Us
                  </Link></li>
              </ul>
            </div>

            {/* SOCIAL */}
            <div>
              <h4 className="font-semibold mb-4">FOLLOW US</h4>
              <div className="flex justify-end gap-3">
                <Link
                  href="https://web.facebook.com/lankatechinnovations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  <Facebook size={16} />
                </Link>

                <Link
                  href="https://www.linkedin.com/company/100231289/admin/dashboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  <Linkedin size={16} />
                </Link>

                <Link
                  href="https://www.tiktok.com/@lankatech_innovations"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
                >
                  <Music2 size={16} />
                </Link>

              </div>
            </div>

          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-300 gap-4">

          <span>© 2026 LankaTech Innovations (PVT) Ltd.</span>

          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer">
              <Link href="/terms" className="hover:text-white transition">
                Terms of Servive
              </Link>
            </span>
            <span>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </span>
            {/* Scroll To Top Button */}
            <span>
                <button onClick={scrollToTop} className="right-6 p-3 rounded-full bg-black hover:bg-white/20 backdrop-blur-md">
                <ArrowUp size={18} />
                </button>
            </span>
          </div>

        </div>

      </div>
    </footer>
  );
}
