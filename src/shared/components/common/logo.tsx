import Image from "next/image";
import Link from "next/link";

import { useGetLogo } from "@/hooks/client";

export function Logo({
  type = "icon",
  className,
}: {
  type?: "icon" | "full";
  className?: string;
}) {
  const { logoIcon, fullLogo } = useGetLogo();
  const src = type === "icon" ? logoIcon : fullLogo;

  return (
    <Link href="/">
      <Image
        src={src}
        width={40}
        height={40}
        alt="Onchain Suite Logo"
        className={className}
        suppressHydrationWarning
      />
    </Link>
  );
}
