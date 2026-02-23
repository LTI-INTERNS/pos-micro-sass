import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https",
        hostname: "**",   // allows any https host
      },
    ],
  },

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