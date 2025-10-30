import { TrendingDown, TrendingUp } from "lucide-react";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { chains, topUsers } from "../data";
import { CrossChainChart } from "./cross-chain-chart";

export function CrossChain() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cross-Chain Analytics</CardTitle>
          <CardDescription>Multi-chain performance comparison</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <CrossChainChart />

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chains.map((chain) => (
              <Card key={chain.name}>
                <CardHeader>
                  <CardTitle className="text-lg">{chain.name}</CardTitle>
                  <CardDescription>Chain Performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Users</span>
                    <span className="font-semibold">{chain.users}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Volume
                    </span>
                    <span className="font-semibold">{chain.volume}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Engagement
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${chain.engagement}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {chain.engagement}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    {chain.change.startsWith("+") ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${chain.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}
                    >
                      {chain.change}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Users Across Chains</CardTitle>
              <CardDescription>Most active multi-chain users</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Wallet Address</TableHead>
                    <TableHead>Active Chains</TableHead>
                    <TableHead>Total Volume</TableHead>
                    <TableHead>Transactions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topUsers.map((user) => (
                    <TableRow key={v7()}>
                      <TableCell className="font-mono text-sm">
                        {user.address}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.chains.map((chain) => (
                            <Badge
                              key={chain}
                              variant="secondary"
                              className="text-xs"
                            >
                              {chain}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {user.volume}
                      </TableCell>
                      <TableCell>{user.txCount.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
