import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/v1/:path*",
          destination: "https://onchain-backend-dvxw.onrender.com/api/v1/:path*",
        },
      ],
    };
  },
};

export default nextConfig;
