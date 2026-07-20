"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

/**
 * Sidebar/nav logo with a two-step failure chain: a broken custom branding
 * URL falls back to the platform logo, and any optimizer-level rejection
 * retries the raw URL unoptimized. Keeps the shell branded even when an
 * org's uploaded logo URL is stale or unreachable in production.
 */
export function BrandLogo({
  src,
  fallbackSrc,
  alt,
  className,
  size,
  unoptimized = false,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  size: number;
  unoptimized?: boolean;
}) {
  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    setStep(0);
  }, [src]);

  if (step === 2) return null;
  const resolvedSrc = step === 1 && src !== fallbackSrc ? fallbackSrc : src;

  return (
    <Image
      src={resolvedSrc}
      width={size}
      height={size}
      alt={alt}
      className={className}
      unoptimized={unoptimized || step > 0}
      onError={() => setStep((current) => (current === 0 ? 1 : 2) as 1 | 2)}
    />
  );
}
