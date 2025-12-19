import Image from "next/image";
import Link from "next/link";

import { useGetLogo } from "@/hooks/client";
import { cn } from "@/lib/utils";

export function Logo({
  type = "icon",
  className,
}: {
  type?: "icon" | "full";
  className?: string;
}) {
  const { lightIcon, darkIcon, lightFull, darkFull } = useGetLogo();
  const lightSrc = type === "icon" ? lightIcon : lightFull;
  const darkSrc = type === "icon" ? darkIcon : darkFull;

  return (
    <Link href="/">
      <Image
        src={lightSrc}
        width={40}
        height={40}
        alt="Onchain Suite Logo"
        className={cn(className, "dark:hidden")}
      />
      <Image
        src={darkSrc}
        width={40}
        height={40}
        alt="Onchain Suite Logo"
        className={cn(className, "hidden dark:block")}
      />
    </Link>
  );
}
