/* Brand-accurate (simplified) logo marks for the integrations grid. Inline SVG
   so they're crisp, tree-shakeable, and need no network fetch. */

import { BaseLogo, EthereumLogo, PolygonLogo, SolanaLogo } from "./chain-logos";

type LogoProps = { size?: number };

function Frame({
  size = 22,
  bg,
  children,
  rounded = 6,
}: {
  size?: number;
  bg?: string;
  rounded?: number;
  children: React.ReactNode;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      {bg ? <rect width="32" height="32" rx={rounded} fill={bg} /> : null}
      {children}
    </svg>
  );
}

function MetaMaskLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#FFF3E8">
      <path d="M25.5 6 17.6 11.8 19.1 8.4z" fill="#E2761B" />
      <path
        d="M6.5 6l7.8 5.9-1.4-3.5zM22.6 21.1l-2.1 3.2 4.5 1.2 1.3-4.3zM5.7 21.2 7 25.5l4.5-1.2-2.1-3.2z"
        fill="#E4761B"
      />
      <path
        d="M11.2 14.6l-1.3 1.9 4.4.2-.2-4.8zm9.6 0-3-2.7-.1 4.9 4.4-.2zM11.5 24.3l2.7-1.3-2.3-1.8zm6.3-1.3 2.7 1.3-.4-3.1z"
        fill="#E4761B"
      />
      <path
        d="M20.5 24.3l-2.7-1.3.2 1.8v.9zM11.5 24.3l2.5 1.4v-.9l.2-1.8z"
        fill="#D7C1B3"
      />
      <path d="M14.1 19.6l-2.2-.6 1.6-.7zm3.8 0 .6-1.3 1.6.7z" fill="#233447" />
      <path
        d="M11.5 24.3l.4-3.2-2.5.1zm8.6-3.2.4 3.2 2.1-3.1zm2.4-4.6-4.4.2.4 2.3.6-1.3 1.6.7zm-10.6 1.9 1.6-.7.6 1.3.4-2.3-4.4-.2z"
        fill="#CD6116"
      />
      <path
        d="M9.9 16.5l1.9 3.6-.1-1.8zm10.5 1.8-.1 1.8 1.9-3.6zm-6.1.4-.4 2.3.5 2.6.1-3.4zm3.4 0-.2 1.5.1 3.4.5-2.6z"
        fill="#E4751F"
      />
      <path
        d="M17.9 19.6l-.5 2.6.4.3 2.3-1.8.1-1.8zm-6-.7.1 1.8 2.3 1.8.4-.3-.5-2.6z"
        fill="#F6851B"
      />
      <path
        d="M18 25.7v-.9l-.2-.2h-3.5l-.3.2v.9l-2.5-1.2.9.7 1.8 1.3h3.6l1.8-1.3.9-.7z"
        fill="#C0AD9E"
      />
      <path
        d="M17.8 23l-.4-.3h-2.7l-.4.3-.2 1.8.3-.2h3.5l.3.2z"
        fill="#161616"
      />
      <path
        d="M25.9 12.2 26.5 9l-1-3-7.7 5.7 3 2.5 4.2 1.2 1-1.1-.4-.3.6-.6-.5-.4.6-.5zM5.5 9l.7 3.2-.4.3.6.5-.5.4.6.6-.4.3.9 1.1 4.2-1.2 3-2.5L6.5 6z"
        fill="#763D16"
      />
      <path
        d="M25 15.1l-4.2-1.2 1.3 1.9-1.9 3.6 2.5 0h3.7zm-14-1.2L6.8 15.1l-1.4 4.3h3.7l2.5 0-1.9-3.6zm6.8 2.5.3-4.6.4-2.4h-5.9l.4 2.4.3 4.6.1 1.5v3.4h2.7v-3.4z"
        fill="#F6851B"
      />
    </Frame>
  );
}

function PhantomLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#AB9FF2" rounded={9}>
      <path
        d="M25 16.2c0 4.6-3.8 8.3-8.6 8.3-4.4 0-8-3.1-8.5-7.1-.1-.7.5-1.2 1.2-1.2h2.2c.6 0 1 .4 1.2.9.5 1.3 1.8 2.2 3.2 2.1 1.6-.1 2.9-1.5 2.9-3.2v-.3c0-1.8-1.5-3.2-3.3-3.2H9.3c-.7 0-1.2-.6-1.1-1.3C8.7 9.9 12 7.4 15.9 7.4c5 0 9.1 3.9 9.1 8.8z"
        fill="#fff"
      />
      <circle cx="13.3" cy="14.6" r="1.1" fill="#AB9FF2" />
      <circle cx="17.2" cy="14.6" r="1.1" fill="#AB9FF2" />
    </Frame>
  );
}

function WalletConnectLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#E9F0FF" rounded={9}>
      <path
        d="M10.3 13.2c3.1-3 8.3-3 11.4 0l.4.4c.2.2.2.4 0 .6l-1.3 1.2c-.1.1-.2.1-.3 0l-.5-.5c-2.2-2.1-5.7-2.1-7.9 0l-.6.5c-.1.1-.2.1-.3 0l-1.3-1.2c-.2-.2-.2-.4 0-.6zM24.4 15.7l1.1 1.1c.2.2.2.4 0 .6l-5.1 4.9c-.2.2-.5.2-.7 0l-3.6-3.5c0-.1-.1-.1-.2 0L12.4 22c-.2.2-.5.2-.7 0l-5.2-5c-.2-.2-.2-.4 0-.6l1.1-1.1c.2-.2.5-.2.7 0l3.6 3.5c.1.1.2.1.2 0l3.6-3.5c.2-.2.5-.2.7 0l3.6 3.5c.1.1.2.1.2 0l3.6-3.5c.3-.2.6-.2.8-.1z"
        fill="#3B99FC"
      />
    </Frame>
  );
}

function RabbyLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#8697FF" rounded={9}>
      <path
        d="M25 17.3c.7-1.5-2.5-5.6-5.4-7-1.9-1.2-3.9-1-4.3-.4-.9 1.3 2.2 2.4 4.2 3.4-1 .4-2.2 1.3-2.8 2.6-1.4-1.3-4.4-2.4-7.8-1.1C6.1 16 5.1 18.7 6.6 21c1.6 2.5 5 3 7.4 2.1 1.3-.5 1.4-1.5 3-1.7 1.7-.2 2.6.8 3.6.4 1-.4 1-1.6 1.8-2.4.7-.7 2-.7 2.6-2.1z"
        fill="#fff"
      />
      <circle cx="20.2" cy="16.7" r="1" fill="#8697FF" />
    </Frame>
  );
}

function DiscordLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#5865F2" rounded={9}>
      <path
        d="M22.6 10.6A14 14 0 0 0 19 9.5l-.2.4c1.6.4 2.4 1 3.2 1.7a11 11 0 0 0-9.9 0c.8-.7 1.7-1.3 3.2-1.7l-.2-.4c-1.4.3-2.6.7-3.6 1.1-1.9 2.8-2.4 5.6-2.2 8.3a13 13 0 0 0 4 2 9 9 0 0 0 .8-1.4c-.4-.2-.9-.4-1.3-.6l.3-.2c2.5 1.2 5.4 1.2 7.9 0l.3.2c-.4.2-.9.4-1.3.6.2.5.5 1 .8 1.4a13 13 0 0 0 4-2c.3-3.2-.5-6-2.3-8.3zM13.4 17.1c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6zm5.2 0c-.8 0-1.4-.7-1.4-1.6s.6-1.6 1.4-1.6 1.4.7 1.4 1.6-.6 1.6-1.4 1.6z"
        fill="#fff"
      />
    </Frame>
  );
}

function TelegramLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#2AABEE" rounded={9}>
      <path
        d="M23.4 9.7 6.9 16c-1 .4-1 1.8.1 2.1l3.8 1.2 1.5 4.6c.2.6.9.8 1.4.4l2.1-1.7 3.9 2.9c.5.4 1.3.1 1.4-.5l2.7-13c.2-.9-.6-1.6-1.4-1.3zM11 18.8l8.4-5.2c.2-.1.4.2.2.3l-6.9 6.4c-.2.2-.4.5-.4.8l-.2 1.7z"
        fill="#fff"
      />
    </Frame>
  );
}

function DuneLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#1A1A1A" rounded={9}>
      <path d="M7 21a9 9 0 0 1 18-7.6c-3 5-9.7 8.4-18 7.6z" fill="#F4603E" />
      <path
        d="M7 22a9 9 0 0 0 17.5-3.1C19 22 12.6 23 7 22z"
        fill="#fff"
        opacity=".9"
      />
    </Frame>
  );
}

function PrivyLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#0F0F0F" rounded={9}>
      <path
        d="M16 7c3.2 0 5.6 2.4 5.6 5.6 0 3.1-2.4 5.5-5.4 5.6V25h-3.2V7z"
        fill="#fff"
      />
      <circle cx="16" cy="12.6" r="2.3" fill="#0F0F0F" />
    </Frame>
  );
}

function DynamicLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#E9ECFF" rounded={9}>
      <circle
        cx="16"
        cy="16"
        r="8"
        fill="none"
        stroke="#5B4DEE"
        strokeWidth="2.4"
      />
      <circle cx="16" cy="16" r="3" fill="#5B4DEE" />
    </Frame>
  );
}

function WebhookLogo({ size }: LogoProps) {
  return (
    <Frame size={size} bg="#EAF1FB" rounded={9}>
      <circle cx="12.5" cy="12" r="2.4" fill="#1727E0" />
      <circle cx="20.5" cy="18.5" r="2.4" fill="#1727E0" />
      <circle cx="11" cy="20.5" r="2.4" fill="#1727E0" />
      <path
        d="M12.5 12.5 9 18.5M20 18.5h-7M13.5 11.5l5.5 5.5"
        stroke="#1727E0"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
    </Frame>
  );
}

export type Integration = {
  name: string;
  Logo: (p: LogoProps) => React.JSX.Element;
};

export const INTEGRATIONS: Integration[] = [
  { name: "MetaMask", Logo: MetaMaskLogo },
  { name: "Phantom", Logo: PhantomLogo },
  { name: "WalletConnect", Logo: WalletConnectLogo },
  { name: "Rabby", Logo: RabbyLogo },
  { name: "Ethereum", Logo: (p) => <EthereumLogo size={p.size} /> },
  { name: "Solana", Logo: (p) => <SolanaLogo size={p.size} /> },
  { name: "Base", Logo: (p) => <BaseLogo size={p.size} /> },
  { name: "Polygon", Logo: (p) => <PolygonLogo size={p.size} /> },
  { name: "Discord", Logo: DiscordLogo },
  { name: "Telegram", Logo: TelegramLogo },
  { name: "Dune", Logo: DuneLogo },
  { name: "Privy", Logo: PrivyLogo },
  { name: "Dynamic", Logo: DynamicLogo },
  { name: "Webhooks", Logo: WebhookLogo },
];
