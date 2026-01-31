import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
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
    let backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    
    // Ensure backendUrl is absolute and valid
    if (!backendUrl || backendUrl.startsWith("/")) {
      console.warn("BACKEND_URL is missing or relative, falling back to default Render URL");
      backendUrl = "https://onchain-backend-dvxw.onrender.com/api/v1";
    }

    return [
      {
        source: "/api/v1/auth/session",
        destination: `${backendUrl}/auth/get-session`,
      },
      {
        source: "/api/v1/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
