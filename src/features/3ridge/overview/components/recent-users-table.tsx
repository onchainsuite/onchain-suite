import { ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { v7 } from "uuid";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

import { PRIVATE_ROUTES } from "@/config/app-routes";

const recentUsers = [
  {
    address: "vitalik.eth",
    labels: ["High Value", "Returning"],
    netWorth: "$2.4M",
    chains: ["Ethereum", "Optimism", "Base"],
    lastSeen: "5 min ago",
  },
  {
    address: "0x742d...35a3",
    labels: ["New User"],
    netWorth: "$15.2K",
    chains: ["Ethereum"],
    lastSeen: "2 hours ago",
  },
  {
    address: "alice.eth",
    labels: ["High Value", "Developer"],
    netWorth: "$890K",
    chains: ["Ethereum", "Polygon", "Arbitrum", "Base"],
    lastSeen: "1 hour ago",
  },
];

export function RecentUsersTable() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <CardTitle>Recent Users</CardTitle>
            </div>
            <CardDescription>Latest user profiles and activity</CardDescription>
          </div>
          <Link href={PRIVATE_ROUTES.BRIDGE.PROFILES.ROOT}>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 bg-transparent"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Address</TableHead>
                <TableHead>Labels</TableHead>
                <TableHead>Net Worth</TableHead>
                <TableHead>Chains</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow
                  key={v7()}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-mono text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold">
                        {user.address[0].toUpperCase()}
                      </div>
                      {user.address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.labels.map((label) => (
                        <Badge key={v7()} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-primary">
                    {user.netWorth}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.chains.slice(0, 2).map((chain) => (
                        <Badge key={v7()} variant="outline" className="text-xs">
                          {chain}
                        </Badge>
                      ))}
                      {user.chains.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.chains.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastSeen}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
