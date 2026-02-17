import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
      protocol: "https",
      hostname: "i.pravatar.cc",
      },
    ],
  },

// Add redirects
  async redirects() {
    return [
      {
        source: '/',
        destination: '/saaslanding',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
