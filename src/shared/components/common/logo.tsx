import Image from "next/image";
import Link from "next/link";

import { useGetLogo } from "@/hooks/client";

export function Logo() {
  const { logoIcon } = useGetLogo();

  return (
    <Link href="/">
      <Image
        src={logoIcon}
        width={40}
        height={40}
        alt="Onchain Suite Logo"
        suppressHydrationWarning
      />
    </Link>
  );
}
