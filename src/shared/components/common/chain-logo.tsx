import Image from "next/image";

import {
  getChainLogoUrl,
  WALLET_LOGO_URLS,
  type WalletLogoKey,
} from "@/shared/config/brand-logos";

/**
 * Official chain logo for an API chain identifier (`eth-mainnet`, `Base`,
 * `polygon-mainnet`, …). Renders nothing when the chain has no asset, so it
 * can be dropped next to any chain label without a guard at the call site.
 */
export function ChainLogo({
  chain,
  size = 14,
  className,
}: {
  chain: string;
  size?: number;
  className?: string;
}) {
  const url = getChainLogoUrl(chain);
  if (!url) return null;
  return (
    <Image
      src={url}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className={`inline-block shrink-0 rounded-[3px] object-contain ${className ?? ""}`}
    />
  );
}

/** Official wallet brand mark (MetaMask, Phantom, WalletConnect, Rabby). */
export function WalletLogo({
  wallet,
  size = 16,
  className,
}: {
  wallet: WalletLogoKey;
  size?: number;
  className?: string;
}) {
  return (
    <Image
      src={WALLET_LOGO_URLS[wallet]}
      alt={wallet}
      width={size}
      height={size}
      className={`inline-block shrink-0 rounded-[3px] object-contain ${className ?? ""}`}
    />
  );
}
