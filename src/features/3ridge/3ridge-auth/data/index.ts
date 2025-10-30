import {
  Chrome,
  Eye,
  Fingerprint,
  Github,
  Linkedin,
  Twitter,
} from "lucide-react";

export const biometricMethods = [
  {
    name: "Fingerprint",
    icon: Fingerprint,
    enabled: true,
    users: 8234,
    color: "text-teal-500",
  },
  {
    name: "Face ID",
    icon: Eye,
    enabled: true,
    users: 6891,
    color: "text-violet-500",
  },
  {
    name: "Touch ID",
    icon: Fingerprint,
    enabled: true,
    users: 5432,
    color: "text-primary",
  },
  {
    name: "Iris Scan",
    icon: Eye,
    enabled: false,
    users: 0,
    color: "text-muted-foreground",
  },
];

export const oauthProviders = [
  {
    name: "Google",
    icon: Chrome,
    status: "active" as const,
    users: 18234,
    color: "text-red-500",
  },
  {
    name: "GitHub",
    icon: Github,
    status: "active" as const,
    users: 12456,
    color: "text-foreground",
  },
  {
    name: "Twitter",
    icon: Twitter,
    status: "active" as const,
    users: 8921,
    color: "text-blue-500",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    status: "inactive" as const,
    users: 0,
    color: "text-blue-600",
  },
];

export const walletProviders = [
  { name: "MetaMask", status: "active", users: 12453, zkSync: true },
  { name: "WalletConnect", status: "active", users: 8921, zkSync: true },
  { name: "Coinbase Wallet", status: "active", users: 6234, zkSync: true },
  { name: "Rainbow", status: "active", users: 3456, zkSync: false },
  { name: "Trust Wallet", status: "pending", users: 1234, zkSync: true },
];

export const recentConnections = [
  {
    wallet: "0x742d...3f4a",
    provider: "MetaMask",
    time: "2 min ago",
    status: "success" as const,
  },
  {
    wallet: "0x8a3c...9b2d",
    provider: "WalletConnect",
    time: "5 min ago",
    status: "success" as const,
  },
  {
    wallet: "0x1f5e...7c8b",
    provider: "Coinbase Wallet",
    time: "12 min ago",
    status: "failed" as const,
  },
  {
    wallet: "0x9d2a...4e6f",
    provider: "MetaMask",
    time: "18 min ago",
    status: "success" as const,
  },
];
