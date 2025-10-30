export const mockUsers = [
  {
    address: "vitalik.eth",
    labels: ["High Value", "Returning"],
    netWorth: "$2.4M",
    socials: ["twitter", "farcaster"],
    apps: 3,
    tokens: 12,
    chains: ["Ethereum", "Optimism", "Base"],
    firstSeen: "2 months ago",
    lastSeen: "5 min ago",
  },
  {
    address: "0x742d...35a3",
    labels: ["New User"],
    netWorth: "$15.2K",
    socials: ["twitter"],
    apps: 1,
    tokens: 4,
    chains: ["Ethereum"],
    firstSeen: "3 days ago",
    lastSeen: "2 hours ago",
  },
  {
    address: "alice.eth",
    labels: ["High Value", "Developer"],
    netWorth: "$890K",
    socials: ["twitter", "discord", "farcaster"],
    apps: 8,
    tokens: 24,
    chains: ["Ethereum", "Polygon", "Arbitrum", "Base"],
    firstSeen: "6 months ago",
    lastSeen: "1 hour ago",
  },
  {
    address: "0x8f3a...92b1",
    labels: ["Returning"],
    netWorth: "$42.8K",
    socials: ["discord"],
    apps: 2,
    tokens: 7,
    chains: ["Ethereum", "Optimism"],
    firstSeen: "1 month ago",
    lastSeen: "30 min ago",
  },
  {
    address: "bob.eth",
    labels: ["High Value", "Whale"],
    netWorth: "$5.2M",
    socials: ["twitter", "farcaster"],
    apps: 12,
    tokens: 45,
    chains: ["Ethereum", "Polygon", "Arbitrum", "Optimism", "Base"],
    firstSeen: "1 year ago",
    lastSeen: "10 min ago",
  },
];

export const duplicateSuggestions = [
  {
    id: 1,
    profiles: [
      {
        id: "0x742d...3f4a",
        email: "john@example.com",
        wallets: 2,
        lastActive: "2 hours ago",
      },
      {
        id: "0x8a3c...9b2d",
        email: "john.doe@example.com",
        wallets: 1,
        lastActive: "1 day ago",
      },
    ],
    confidence: 95,
    reason: "Same email domain, similar wallet addresses",
  },
  {
    id: 2,
    profiles: [
      {
        id: "0x1f5e...7c8b",
        email: "alice@startup.io",
        wallets: 3,
        lastActive: "5 min ago",
      },
      {
        id: "0x9d2a...4e6f",
        email: "alice.smith@startup.io",
        wallets: 2,
        lastActive: "3 hours ago",
      },
    ],
    confidence: 88,
    reason: "Matching OAuth provider, overlapping wallet activity",
  },
  {
    id: 3,
    profiles: [
      {
        id: "0x3c7b...1a9e",
        email: "dev@company.com",
        wallets: 1,
        lastActive: "1 hour ago",
      },
      {
        id: "0x6f2d...8c4a",
        email: "developer@company.com",
        wallets: 2,
        lastActive: "30 min ago",
      },
    ],
    confidence: 82,
    reason: "Same company domain, similar login patterns",
  },
];

export const mergeHistory = [
  {
    date: "2024-01-15",
    primary: "0x742d...3f4a",
    merged: ["0x8a3c...9b2d", "0x1f5e...7c8b"],
    status: "success",
  },
  {
    date: "2024-01-14",
    primary: "0x9d2a...4e6f",
    merged: ["0x3c7b...1a9e"],
    status: "success",
  },
  {
    date: "2024-01-13",
    primary: "0x6f2d...8c4a",
    merged: ["0x2b8e...5d1c"],
    status: "failed",
  },
];
