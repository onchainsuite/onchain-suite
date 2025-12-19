"use client";

import { motion } from "framer-motion";
import { Code, Copy, Loader2, Mail, Play, Plus, X, Zap } from "lucide-react";
import Link from "next/link";
import { useCallback, useState } from "react";

const DEFAULT_SQL_QUERY = `SELECT
  u.wallet,
  u.email,
  u.engagement_score,
  pp.volume_last_90d,
  pp.last_active_days_ago
FROM users u
INNER JOIN pudgy_penguins.activity pp ON u.wallet = pp.wallet
WHERE pp.volume_last_90d > 5000
  AND pp.last_active_days_ago > 60
ORDER BY pp.volume_last_90d DESC`;

const mockQueryResults = [
  {
    id: "1",
    name: "whale.eth",
    wallet: "0x7a2...f4e2",
    email: "whale@defi.com",
    volume: "$847,234",
    engagement: "Cold",
    ltv: "$12,400",
    avatar: "W",
    score: 94,
    lastActive: 67,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "2",
    name: "degen.base",
    wallet: "0x3b1...a8c9",
    email: "degen@base.org",
    volume: "$523,891",
    engagement: "Cold",
    ltv: "$8,200",
    avatar: "D",
    score: 87,
    lastActive: 82,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "3",
    name: "nftking.eth",
    wallet: "0x9c4...b2d1",
    email: "king@nft.io",
    volume: "$412,567",
    engagement: "Cold",
    ltv: "$6,800",
    avatar: "N",
    score: 72,
    lastActive: 91,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "4",
    name: "yield_maxi",
    wallet: "0x5e8...f7f3",
    email: "yield@maxi.io",
    volume: "$389,234",
    engagement: "Warm",
    ltv: "$5,400",
    avatar: "Y",
    score: 65,
    lastActive: 74,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "5",
    name: "onchain_og",
    wallet: "0x1d2...e9a6",
    email: "og@chain.xyz",
    volume: "$287,123",
    engagement: "Cold",
    ltv: "$9,100",
    avatar: "O",
    score: 91,
    lastActive: 63,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "6",
    name: "basehodler",
    wallet: "0x6f7...d4b8",
    email: "hodl@base.net",
    volume: "$234,567",
    engagement: "Cold",
    ltv: "$4,200",
    avatar: "B",
    score: 68,
    lastActive: 95,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "7",
    name: "pudgy_lover",
    wallet: "0x8a3...f1c5",
    email: "pudgy@lover.com",
    volume: "$198,432",
    engagement: "Warm",
    ltv: "$2,100",
    avatar: "P",
    score: 58,
    lastActive: 88,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "8",
    name: "defi_wizard",
    wallet: "0x2c9...a3e7",
    email: "wiz@defi.app",
    volume: "$176,891",
    engagement: "Cold",
    ltv: "$7,300",
    avatar: "D",
    score: 85,
    lastActive: 71,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "9",
    name: "nft_flipper",
    wallet: "0x4e1...b5d2",
    email: "flipper@nft.market",
    volume: "$156,234",
    engagement: "Cold",
    ltv: "$3,800",
    avatar: "N",
    score: 62,
    lastActive: 78,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
  {
    id: "10",
    name: "crypto_kate",
    wallet: "0x7b8...c9e4",
    email: "kate@crypto.vc",
    volume: "$134,567",
    engagement: "Warm",
    ltv: "$5,600",
    avatar: "C",
    score: 78,
    lastActive: 65,
    sourceContract: "0xBd3531...Penguins",
    contractLabel: "Pudgy Penguins",
  },
];

// const exampleQueries = [
//   {
//     name: "Your Pudgy Holders",
//     description: "Your users who hold Pudgy Penguins NFTs",
//     icon: Anchor,
//     query: `SELECT u.wallet, u.email, u.engagement_score, pp.volume_usd
// FROM users u
// INNER JOIN pudgy_penguins.holders pp ON u.wallet = pp.wallet
// WHERE pp.volume_usd > 5000
// ORDER BY pp.volume_usd DESC`,
//   },
//   {
//     name: "Your Base Power Users",
//     description: "Your users active on Base chain",
//     icon: Flame,
//     query: `SELECT u.wallet, u.email, u.ltv, b.tvl_usd, b.tx_count
// FROM users u
// INNER JOIN base.wallet_stats b ON u.wallet = b.wallet
// WHERE b.tvl_usd > 10000
// ORDER BY b.tvl_usd DESC`,
//   },
//   {
//     name: "Your DeFi Stakers",
//     description: "Your users with DeFi positions",
//     icon: Target,
//     query: `SELECT u.wallet, u.email, d.staked_usd, d.protocol
// FROM users u
// INNER JOIN ethereum.defi_positions d ON u.wallet = d.wallet
// WHERE d.staked_usd > 25000`,
//   },
//   {
//     name: "Your Dormant Whales",
//     description: "Your high-value users inactive 90+ days",
//     icon: Crosshair,
//     query: `SELECT u.wallet, u.email, u.ltv, u.last_active_date
// FROM users u
// WHERE u.ltv > 5000
//   AND u.last_active_date < NOW() - INTERVAL '90 days'`,
//   },
//   {
//     name: "Your Multi-chain Users",
//     description: "Your users active on 3+ chains",
//     icon: Layers,
//     query: `SELECT u.wallet, u.email, COUNT(DISTINCT c.chain) as chains
// FROM users u
// INNER JOIN all_chains.activity c ON u.wallet = c.wallet
// GROUP BY u.wallet, u.email
// HAVING COUNT(DISTINCT c.chain) >= 3`,
//   },
// ];

interface QueryTabProps {
  openEmailComposer: (recipient: unknown) => void;
  setActiveTab: (tab: string) => void;
}

export function QueryTab({ openEmailComposer, setActiveTab }: QueryTabProps) {
  const [sqlQuery, setSqlQuery] = useState(DEFAULT_SQL_QUERY);
  const [isQueryRunning, setIsQueryRunning] = useState(false);
  const [queryResults, setQueryResults] =
    useState<typeof mockQueryResults>(mockQueryResults);
  const [hasRunQuery, setHasRunQuery] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  // const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const totalRows = 714;
  const potentialRevenue = "$127k";

  const runQuery = useCallback(() => {
    setIsQueryRunning(true);
    setHasRunQuery(true);
    setTimeout(() => {
      setQueryResults(mockQueryResults);
      setIsQueryRunning(false);
    }, 600);
  }, []);

  const toggleRowSelection = useCallback((id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  }, []);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.length === queryResults.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(queryResults.map((r) => r.id));
    }
  }, [selectedRows.length, queryResults]);

  const getEngagementColor = useCallback((engagement: string) => {
    switch (engagement) {
      case "Hot":
        return "bg-secondary/10 text-secondary";
      case "Warm":
        return "bg-primary/10 text-primary";
      case "Cold":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-secondary text-muted-foreground";
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-primary/90 px-4 py-2">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary/90">
              SQL Editor
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigator.clipboard.writeText(sqlQuery)}
              className="rounded p-1.5 text-primary/90 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={runQuery}
              disabled={isQueryRunning}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
            >
              {isQueryRunning ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              Run
            </button>
          </div>
        </div>
        <textarea
          value={sqlQuery}
          onChange={(e) => setSqlQuery(e.target.value)}
          className="h-[200px] w-full resize-none bg-transparent p-4 font-mono text-sm text-primary placeholder-white/30 focus:outline-none"
          spellCheck={false}
        />
      </div>

      {hasRunQuery && queryResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card overflow-hidden"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-foreground">
                {totalRows} of your users
                <span className="ml-2 text-muted-foreground">·</span>
                <span className="ml-2 text-muted-foreground">
                  interacted with Pudgy Penguins
                </span>
              </span>
              <span className="text-sm text-muted-foreground">
                Win-back potential:{" "}
                <span className="font-medium text-primary">
                  {potentialRevenue}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              {selectedRows.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  {selectedRows.length} selected
                  <button
                    onClick={() => setSelectedRows([])}
                    className="ml-2 inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-muted/40"
                  >
                    <X className="h-3 w-3" />
                    Clear
                  </button>
                </span>
              )}
              <Link
                href="/intelligence/segments/create"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:shadow-[0_0_16px_rgba(var(--primary),0.4)]"
                onClick={() => setActiveTab("segments")}
              >
                <Plus className="h-3.5 w-3.5" />
                Create segment
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-left text-xs font-medium text-muted-foreground">
                  <th className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === queryResults.length}
                      onChange={toggleAllRows}
                    />
                  </th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Engagement</th>
                  <th className="px-4 py-3">Volume</th>
                  <th className="px-4 py-3">LTV</th>
                  <th className="px-4 py-3">Last Active</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queryResults.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/50 transition-colors hover:bg-muted/50"
                    // onMouseEnter={() => setHoveredRow(row.id)}
                    // onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-xs font-medium">
                            {row.avatar}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{row.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {row.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${getEngagementColor(row.engagement)}`}
                      >
                        {row.engagement}
                      </span>
                    </td>
                    <td className="px-4 py-3">{row.volume}</td>
                    <td className="px-4 py-3">{row.ltv}</td>
                    <td className="px-4 py-3">{row.lastActive}d</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs bg-primary/10 text-primary">
                        <Zap className="h-3 w-3" />
                        {row.contractLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"
                          onClick={() =>
                            openEmailComposer({
                              name: row.name,
                              email: row.email,
                            })
                          }
                        >
                          <Mail className="mr-1 inline-block h-3.5 w-3.5" />
                          Email
                        </button>
                        <button className="rounded px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10">
                          <Copy className="mr-1 inline-block h-3.5 w-3.5" />
                          Copy
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
