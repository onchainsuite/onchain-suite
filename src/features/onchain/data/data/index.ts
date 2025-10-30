export const entities = [
  { name: "wallets", type: "table", fields: 12, relations: 5 },
  { name: "transactions", type: "table", fields: 8, relations: 3 },
  { name: "contracts", type: "table", fields: 10, relations: 4 },
  { name: "tokens", type: "table", fields: 7, relations: 2 },
  { name: "events", type: "table", fields: 15, relations: 6 },
];

export const mockResults = [
  {
    entity: "wallets",
    matches: 234,
    description: "Wallet addresses that interacted with Curve protocol",
    relations: ["transactions", "contracts"],
  },
  {
    entity: "transactions",
    matches: 1567,
    description: "Transaction records from October 2024",
    relations: ["wallets", "contracts"],
  },
  {
    entity: "contracts",
    matches: 12,
    description: "Curve protocol smart contracts",
    relations: ["transactions", "events"],
  },
];

export const buildMockResults = [
  {
    wallet: "0x742d...3f4a",
    transactions: 234,
    volume: "$45,678",
    lastActive: "2 hours ago",
  },
  {
    wallet: "0x8a3c...9b2d",
    transactions: 189,
    volume: "$32,456",
    lastActive: "5 hours ago",
  },
  {
    wallet: "0x1f5e...7c8b",
    transactions: 156,
    volume: "$28,901",
    lastActive: "1 day ago",
  },
];

export const comments = [
  { user: "Alice", message: "Try filtering by date range", time: "2m ago" },
  { user: "Bob", message: "Added JOIN for user metadata", time: "5m ago" },
];
