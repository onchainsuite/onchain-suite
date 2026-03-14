import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },
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
    return [
      {
        source: "/api/v1/:path*",
        destination:
          process.env.NEXT_PUBLIC_BACKEND_URL
            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/:path*`
            : "https://onchain-backend-dvxw.onrender.com/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
