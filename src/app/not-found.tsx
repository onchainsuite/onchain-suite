"use client";

import { useEffect, useState } from "react";

import {
  MobileOptimizedNotFound,
  NotFoundPage,
} from "@/components/meta-components";

export default function NotFound() {
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      const mobile =
        window.innerWidth < 768 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show simple fallback during SSR
  if (!isClient) {
    return (
      <div className="from-background to-primary/5 flex min-h-screen items-center justify-center bg-linear-to-br p-4">
        <div className="text-center">
          <div className="text-primary mb-4 text-6xl font-black">404</div>
          <h1 className="mb-4 text-2xl font-bold">Page Not Found</h1>
          <p className="text-muted-foreground">
            The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Render mobile-optimized version for mobile devices
  if (isMobile) {
    return <MobileOptimizedNotFound />;
  }

  // Render full version for desktop
  return <NotFoundPage />;
}
